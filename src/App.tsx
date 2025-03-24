import React, { useEffect, useCallback } from 'react';
import { Transport } from './components/Transport';
import { TrackList } from './components/TrackList';
import { useAudioStore } from './store/audioStore';
import { Music } from 'lucide-react';

function App() {
  const { loadAudioFile } = useAudioStore();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.type.startsWith('audio/')) {
        loadAudioFile(file);
      }
    });
  }, [loadAudioFile]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Music className="w-8 h-8 text-blue-400" />
          <h1 className="text-2xl font-bold">Web Audio Workstation</h1>
        </div>
        
        <div className="space-y-6">
          <Transport />
          <TrackList />
          
          <div 
            className="bg-gray-800 p-8 rounded-lg border-2 border-dashed border-gray-600 text-center"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <p className="text-gray-400">
              Drag and drop audio files here to add tracks
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Supported formats: WAV, MP3, OGG, AIFF
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;