import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiLiveClient {
  constructor(apiKey, model = 'gemini-2.0-flash-live-001') {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = model;
    this.session = null;
  }

  async startSession(systemInstructions, onResponse, onError) {
    try {
      const model = this.genAI.getGenerativeModel({ 
        model: this.model,
        systemInstruction: systemInstructions
      });

      this.session = await model.startChat({
        generationConfig: {
          responseModalities: ['audio', 'text'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Aoede'
              }
            }
          }
        }
      });

      // Set up event listeners
      this.session.on('response', onResponse);
      this.session.on('error', onError);

      return true;
    } catch (error) {
      console.error('Failed to start Gemini Live session:', error);
      throw error;
    }
  }

  async sendAudio(audioData) {
    if (!this.session) {
      throw new Error('No active session');
    }

    try {
      await this.session.send({
        mimeType: 'audio/pcm',
        data: audioData
      });
    } catch (error) {
      console.error('Failed to send audio:', error);
      throw error;
    }
  }

  async interrupt() {
    if (this.session) {
      try {
        await this.session.interrupt();
      } catch (error) {
        console.error('Failed to interrupt:', error);
      }
    }
  }

  async endSession() {
    if (this.session) {
      try {
        await this.session.end();
        this.session = null;
      } catch (error) {
        console.error('Failed to end session:', error);
      }
    }
  }
}