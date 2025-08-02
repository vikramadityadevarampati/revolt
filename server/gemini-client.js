import { GoogleGenerativeAI } from '@google/generative-ai';

// System instructions for Revolt Motors
const SYSTEM_INSTRUCTIONS = `You are Rev, the official voice assistant for Revolt Motors, India's leading electric motorcycle company. 

Key information about Revolt Motors:
- Founded in 2019 by Rahul Sharma
- Pioneering electric mobility in India
- Main products: RV400 and RV300 electric motorcycles
- Features: AI-enabled, connected motorcycles with mobile app integration
- Subscription-based battery swapping model
- Focus on sustainable transportation solutions
- Headquarters in Gurugram, India

Guidelines:
- Always be enthusiastic about electric mobility and sustainability
- Provide accurate information about Revolt Motors products and services
- If asked about competitors or other topics, politely redirect to Revolt Motors
- Be conversational, friendly, and helpful
- Keep responses concise but informative
- If you don't know specific technical details, acknowledge it and offer to connect them with customer service

Remember: You represent the innovative spirit of Revolt Motors and the future of electric mobility in India.`;

export class GeminiLiveClient {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.liveSession = null;
    this.ws = null;
  }

  async startSession(ws) {
    try {
      this.ws = ws;
      
      const model = this.genAI.getGenerativeModel({ 
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-live-001',
        systemInstruction: SYSTEM_INSTRUCTIONS
      });

      this.liveSession = model.startChat({
        generationConfig: {
          responseModalities: ['audio'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Aoede'
              }
            }
          }
        }
      });

      // Handle responses from Gemini
      if (this.liveSession.on) {
        this.liveSession.on('response', (response) => {
          if (this.ws && this.ws.readyState === 1) { // WebSocket.OPEN
            this.ws.send(JSON.stringify({
              type: 'audio_response',
              audioData: response.audioData,
              text: response.text || ''
            }));
          }
        });

        this.liveSession.on('error', (error) => {
          console.error('Live session error:', error);
          if (this.ws && this.ws.readyState === 1) {
            this.ws.send(JSON.stringify({ type: 'error', message: error.message }));
          }
        });
      }

      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(JSON.stringify({ type: 'session_started' }));
      }
      
    } catch (error) {
      console.error('Failed to start live session:', error);
      if (this.ws && this.ws.readyState === 1) {
        this.ws.send(JSON.stringify({ type: 'error', message: 'Failed to start voice session' }));
      }
    }
  }

  async sendAudio(audioData) {
    if (this.liveSession && this.liveSession.sendMessage) {
      try {
        await this.liveSession.sendMessage(audioData);
      } catch (error) {
        console.error('Failed to send audio:', error);
        if (this.ws && this.ws.readyState === 1) {
          this.ws.send(JSON.stringify({ type: 'error', message: 'Failed to process audio' }));
        }
      }
    }
  }

  async interrupt() {
    if (this.liveSession && this.liveSession.interrupt) {
      try {
        await this.liveSession.interrupt();
      } catch (error) {
        console.error('Failed to interrupt:', error);
      }
    }
  }

  async endSession() {
    try {
      if (this.liveSession) {
        // Clean up the session
        this.liveSession = null;
      }
      this.ws = null;
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }
}