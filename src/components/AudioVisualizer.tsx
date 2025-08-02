import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isActive: boolean;
  isRecording: boolean;
  isSpeaking: boolean;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  isActive, 
  isRecording, 
  isSpeaking 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (isActive) {
        // Draw animated circles
        const numCircles = 3;
        for (let i = 0; i < numCircles; i++) {
          const radius = 30 + i * 20 + Math.sin(time + i) * 10;
          const opacity = 0.3 - i * 0.1;
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          
          if (isRecording) {
            ctx.strokeStyle = `rgba(239, 68, 68, ${opacity})`;
          } else if (isSpeaking) {
            ctx.strokeStyle = `rgba(34, 197, 94, ${opacity})`;
          } else {
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          }
          
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        
        if (isRecording) {
          ctx.fillStyle = '#ef4444';
        } else if (isSpeaking) {
          ctx.fillStyle = '#22c55e';
        } else {
          ctx.fillStyle = '#3b82f6';
        }
        
        ctx.fill();

        time += 0.1;
      } else {
        // Draw static circle when inactive
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
        ctx.fillStyle = '#9ca3af';
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isRecording, isSpeaking]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="rounded-full"
      />
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-8 h-8 rounded-full ${
            isRecording ? 'bg-red-500' : isSpeaking ? 'bg-green-500' : 'bg-blue-500'
          } animate-pulse`} />
        </div>
      )}
    </div>
  );
};

export default AudioVisualizer;