import express from 'express';
import { WebSocketServer } from 'ws';
import { GoogleGenerativeAI } from '@google/generative-ai';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

// WebSocket server for real-time communication
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  let liveSession = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'start_session':
          await startLiveSession(ws);
          break;
          
        case 'audio_data':
          if (liveSession) {
            // Send audio data to Gemini Live API
            await liveSession.send(data.audioData);
          }
          break;
          
        case 'interrupt':
          if (liveSession) {
            // Handle interruption
            await liveSession.interrupt();
          }
          break;
          
        case 'end_session':
          if (liveSession) {
            await liveSession.end();
            liveSession = null;
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ type: 'error', message: error.message }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    if (liveSession) {
      liveSession.end();
    }
  });

  async function startLiveSession(ws) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-live-001',
        systemInstruction: SYSTEM_INSTRUCTIONS
      });

      liveSession = model.startChat({
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
      liveSession.on('response', (response) => {
        ws.send(JSON.stringify({
          type: 'audio_response',
          audioData: response.audioData,
          text: response.text || ''
        }));
      });

      liveSession.on('error', (error) => {
        console.error('Live session error:', error);
        ws.send(JSON.stringify({ type: 'error', message: error.message }));
      });

      ws.send(JSON.stringify({ type: 'session_started' }));
      
    } catch (error) {
      console.error('Failed to start live session:', error);
      ws.send(JSON.stringify({ type: 'error', message: 'Failed to start voice session' }));
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  console.log(`🚀 Revolt Voice Chat Server running on port ${PORT}`);
  console.log(`📱 WebSocket server ready for connections`);
});