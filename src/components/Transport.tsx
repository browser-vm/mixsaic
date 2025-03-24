import React from 'react';
import { Play, Pause, Square, SkipBack } from 'lucide-react';
import { useAudioStore } from '../store/audioStore';

export const Transport: React.FC = () => {
  const { isPlaying, setIsPlaying, currentTime, setCurrentTime, stopAllTracks } = useAudioStore();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    stopAllTracks();
  };

  const handleRewind = () => {
    setCurrentTime(0);
    stopAllTracks();
  };

  return (
    <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
      <div className="flex gap-2">
        <button
          onClick={handleRewind}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <SkipBack className="w-6 h-6 text-gray-200" />
        </button>
        <button
          onClick={handlePlayPause}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-6 h-6 text-gray-200" />
          ) : (
            <Play className="w-6 h-6 text-gray-200" />
          )}
        </button>
        <button
          onClick={handleStop}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <Square className="w-6 h-6 text-gray-200" />
        </button>
      </div>
      <div className="text-gray-200 font-mono">
        {new Date(currentTime * 1000).toISOString().substr(14, 5)}
      </div>
    </div>
  );
};