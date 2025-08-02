import { useState, useRef, useCallback, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const useVoiceChat = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const connect = useCallback(async () => {
    try {
      // Connect to WebSocket server
      const ws = new WebSocket('ws://localhost:3001');
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsSessionActive(true);
        // Start Gemini Live session
        ws.send(JSON.stringify({ type: 'start_session' }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        switch (data.type) {
          case 'session_started':
            console.log('Gemini Live session started');
            break;
            
          case 'audio_response':
            setIsSpeaking(true);
            // Play audio response
            if (data.audioData) {
              playAudioResponse(data.audioData);
            }
            // Add to chat history
            if (data.text) {
              addMessage('assistant', data.text);
            }
            break;
            
          case 'error':
            console.error('WebSocket error:', data.message);
            break;
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsSessionActive(false);
        setIsRecording(false);
        setIsSpeaking(false);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify({ type: 'end_session' }));
      wsRef.current.close();
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setIsConnected(false);
    setIsSessionActive(false);
    setIsRecording(false);
    setIsSpeaking(false);
  }, [isRecording]);

  const startRecording = useCallback(async () => {
    if (!isConnected) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      });
      
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const arrayBuffer = await audioBlob.arrayBuffer();
        const audioData = new Uint8Array(arrayBuffer);
        
        // Send audio to server
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({
            type: 'audio_data',
            audioData: Array.from(audioData)
          }));
        }
        
        setIsRecording(false);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  }, [isConnected]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const interrupt = useCallback(() => {
    if (wsRef.current && isSpeaking) {
      wsRef.current.send(JSON.stringify({ type: 'interrupt' }));
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const playAudioResponse = useCallback(async (audioData: number[]) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const audioContext = audioContextRef.current;
      const audioBuffer = await audioContext.decodeAudioData(new Uint8Array(audioData).buffer);
      const source = audioContext.createBufferSource();
      
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        setIsSpeaking(false);
      };
      
      source.start();
      
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsSpeaking(false);
    }
  }, []);

  const addMessage = useCallback((type: 'user' | 'assistant', content: string) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, message]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
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
  };
};