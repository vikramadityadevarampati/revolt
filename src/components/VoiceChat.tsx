import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Power, Square } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import ChatHistory from './ChatHistory';
import { useVoiceChat } from '../hooks/useVoiceChat';

const VoiceChat: React.FC = () => {
  const {
    isConnected,
    isRecording,
    isSpeaking,
    isSessionActive,
    chatHistory,
    connect,
    disconnect,
    startRecording,
    stopRecording,
    interrupt
  } = useVoiceChat();

  const [isMuted, setIsMuted] = useState(false);

  const handleToggleSession = () => {
    if (isSessionActive) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleInterrupt = () => {
    if (isSpeaking) {
      interrupt();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Voice Interface */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Talk to Rev
          </h2>
          <p className="text-gray-600">
            Your AI-powered assistant for all things Revolt Motors
          </p>
        </div>

        {/* Connection Status */}
        <div className="flex justify-center mb-6">
          <div className={`px-4 py-2 rounded-full text-sm font-medium ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>

        {/* Audio Visualizer */}
        <div className="flex justify-center mb-8">
          <AudioVisualizer 
            isActive={isRecording || isSpeaking}
            isRecording={isRecording}
            isSpeaking={isSpeaking}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center space-x-4 mb-6">
          {/* Power Button */}
          <button
            onClick={handleToggleSession}
            className={`p-4 rounded-full transition-all duration-200 ${
              isSessionActive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            title={isSessionActive ? 'End Session' : 'Start Session'}
          >
            <Power className="w-6 h-6" />
          </button>

          {/* Microphone Button */}
          <button
            onClick={handleToggleRecording}
            disabled={!isConnected}
            className={`p-4 rounded-full transition-all duration-200 ${
              isRecording
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300'
            }`}
            title={isRecording ? 'Stop Recording' : 'Start Recording'}
          >
            {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>

          {/* Interrupt Button */}
          <button
            onClick={handleInterrupt}
            disabled={!isSpeaking}
            className="p-4 rounded-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 text-white transition-all duration-200"
            title="Interrupt AI"
          >
            <Square className="w-6 h-6" />
          </button>

          {/* Mute Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all duration-200 ${
              isMuted
                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
        </div>

        {/* Status Messages */}
        <div className="text-center">
          {!isConnected && (
            <p className="text-gray-500">Click the power button to start a voice session</p>
          )}
          {isConnected && !isRecording && !isSpeaking && (
            <p className="text-blue-600">Ready to listen - click the microphone to speak</p>
          )}
          {isRecording && (
            <p className="text-red-600 animate-pulse">🎤 Listening...</p>
          )}
          {isSpeaking && (
            <p className="text-green-600">🔊 Rev is speaking... (click interrupt to stop)</p>
          )}
        </div>
      </div>

      {/* Chat History */}
      <ChatHistory messages={chatHistory} />

      {/* Instructions */}
      <div className="bg-blue-50 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How to use:</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            Click the power button to start/end a voice session
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            Hold the microphone button while speaking
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            Use the interrupt button to stop Rev mid-response
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
            Ask about Revolt Motors products, features, and services
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceChat;