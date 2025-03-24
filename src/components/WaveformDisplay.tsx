import React, { useRef, useEffect } from 'react';
import type { Track } from '../types/track';

interface WaveformDisplayProps {
  track: Track;
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({ track }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !track.analyser) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dataArray = new Uint8Array(track.analyser.frequencyBinCount);
    
    const draw = () => {
      if (!ctx || !track.analyser) return;
      
      animationRef.current = requestAnimationFrame(draw);
      
      const width = canvas.width;
      const height = canvas.height;
      
      track.analyser.getByteTimeDomainData(dataArray);
      
      ctx.fillStyle = 'rgb(20, 24, 33)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = track.color;
      ctx.beginPath();
      
      const sliceWidth = width / dataArray.length;
      let x = 0;
      
      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * height / 2;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        x += sliceWidth;
      }
      
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };
    
    draw();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [track]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={80}
      className="w-full rounded-md bg-gray-900"
    />
  );
};