# Revolt Motors Voice Assistant

A real-time voice interface application that replicates the functionality of the Revolt Motors chatbot using Google's Gemini Live API. This application provides natural conversation capabilities with voice interruption support and low-latency responses.

## 🚀 Features

- **Real-time Voice Interaction**: Natural conversation flow with AI assistant
- **Voice Interruption**: Ability to interrupt AI mid-response
- **Low Latency**: Optimized for 1-2 second response times
- **Server-to-Server Architecture**: Secure API key handling
- **Revolt Motors Context**: AI assistant specialized in Revolt Motors information
- **Modern UI**: Clean, responsive interface with audio visualizations
- **Chat History**: Visual conversation history tracking

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **WebSocket** for real-time communication
- **Google Gemini Live API** for voice processing
- **CORS** enabled for cross-origin requests

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Web Audio API** for audio processing
- **WebSocket Client** for real-time communication

## 📋 Prerequisites

- Node.js 18+ installed
- Google AI Studio API key
- Modern web browser with microphone access

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd revolt-voice-chat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   GEMINI_MODEL=gemini-2.0-flash-live-001
   PORT=3001
   ```

4. **Get your API Key**
   - Visit [Google AI Studio](https://aistudio.google.com)
   - Create a free account
   - Generate an API key
   - Add it to your `.env` file

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend development server on `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 🎯 Usage Instructions

1. **Start Session**: Click the power button to initialize the voice session
2. **Speak**: Hold the microphone button while speaking your question
3. **Listen**: Release the button and wait for Rev's response
4. **Interrupt**: Click the interrupt button to stop Rev mid-response
5. **End Session**: Click the power button again to end the session

## 🔧 API Configuration

### Model Options

For **production** (final submission):
```env
GEMINI_MODEL=gemini-2.5-flash-preview-native-audio-dialog
```

For **development** (testing):
```env
GEMINI_MODEL=gemini-2.0-flash-live-001
# or
GEMINI_MODEL=gemini-live-2.5-flash-preview
```

### System Instructions

The AI is configured with specific instructions about Revolt Motors:
- Company information and history
- Product details (RV400, RV300)
- Features and services
- Sustainability focus
- Customer service guidelines

## 🏗️ Architecture

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   React Client  │ ←──────────────→ │  Node.js Server │
│                 │                 │                 │
│ - Voice UI      │                 │ - WebSocket     │
│ - Audio Capture │                 │ - Gemini Client │
│ - Playback      │                 │ - Session Mgmt  │
└─────────────────┘                 └─────────────────┘
                                            │
                                            ▼
                                    ┌─────────────────┐
                                    │  Gemini Live    │
                                    │      API        │
                                    └─────────────────┘
```

## 📁 Project Structure

```
revolt-voice-chat/
├── server/
│   ├── index.js              # Express server & WebSocket
│   └── gemini-client.js      # Gemini API wrapper
├── src/
│   ├── components/
│   │   ├── VoiceChat.tsx     # Main voice interface
│   │   ├── AudioVisualizer.tsx
│   │   ├── ChatHistory.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── hooks/
│   │   └── useVoiceChat.ts   # Voice chat logic
│   └── App.tsx
├── .env.example
├── package.json
└── README.md
```

## 🎥 Demo Requirements

For submission, create a 30-60 second video showing:
1. Natural conversation with the AI
2. Clear interruption demonstration
3. Overall responsiveness and low latency
4. Upload to Google Drive with public viewing permissions

## 🔍 Testing & Debugging

### WebSocket Connection
- Check browser console for connection status
- Verify server is running on correct port
- Ensure API key is valid

### Audio Issues
- Grant microphone permissions
- Check browser audio settings
- Verify WebRTC support

### API Rate Limits
- Switch to development model for testing
- Monitor API usage in Google AI Studio
- Implement proper error handling

## 🚨 Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Ensure server is running
   - Check firewall settings
   - Verify port availability

2. **Microphone Not Working**
   - Grant browser permissions
   - Check system audio settings
   - Try different browser

3. **API Key Issues**
   - Verify key is correct
   - Check API quotas
   - Ensure proper model access

4. **High Latency**
   - Check internet connection
   - Switch to faster model
   - Optimize audio settings

## 📚 Resources

- [Gemini Live API Documentation](https://ai.google.dev/gemini-api/docs/live)
- [Interactive Playground](https://aistudio.google.com/live)
- [Example Applications](https://ai.google.dev/gemini-api/docs/live#example-applications)
- [Revolt Motors Website](https://revoltmotors.com)
- [Live Demo Reference](https://live.revoltmotors.com)

## 🤝 Contributing

This project was built as a technical assessment. For improvements:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for demonstration purposes only.