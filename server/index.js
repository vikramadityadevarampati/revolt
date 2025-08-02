import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { GeminiLiveClient } from './gemini-client.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// WebSocket server for real-time communication
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  let geminiClient = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      switch (data.type) {
        case 'start_session':
          geminiClient = new GeminiLiveClient(process.env.GEMINI_API_KEY);
          await geminiClient.startSession(ws);
          break;
          
        case 'audio_data':
          if (geminiClient) {
            // Send audio data to Gemini Live API
            await geminiClient.sendAudio(data.audioData);
          }
          break;
          
        case 'interrupt':
          if (geminiClient) {
            // Handle interruption
            await geminiClient.interrupt();
          }
          break;
          
        case 'end_session':
          if (geminiClient) {
            await geminiClient.endSession();
            geminiClient = null;
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
    if (geminiClient) {
      geminiClient.endSession();
      geminiClient = null;
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

server.listen(PORT, () => {
  console.log(`🚀 Revolt Voice Chat Server running on port ${PORT}`);
  console.log(`📱 WebSocket server ready for connections`);
});