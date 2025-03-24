import React from 'react';
import { Volume2, Mic, Music, Play, Square } from 'lucide-react';
import { useAudioStore } from '../store/audioStore';
import { WaveformDisplay } from './WaveformDisplay';
import { EffectsRack } from './EffectsRack';
import type { Track } from '../types/track';

export const TrackList: React.FC = () => {
  const { tracks, updateTrack, removeTrack, playTrack, stopTrack } = useAudioStore();

  const handleVolumeChange = (id: string, volume: number) => {
    updateTrack(id, { volume });
    const track = tracks.find(t => t.id === id);
    if (track?.audioSource) {
      track.audioSource.volume.value = volume;
    }
  };

  const handlePanChange = (id: string, pan: number) => {
    updateTrack(id, { pan });
    const track = tracks.find(t => t.id === id);
    if (track?.audioSource) {
      track.audioSource.pan.value = pan;
    }
  };

  const handleMuteToggle = (track: Track) => {
    updateTrack(track.id, { muted: !track.muted });
    if (track.audioSource) {
      track.audioSource.mute = !track.muted;
    }
  };

  const handleSoloToggle = (track: Track) => {
    updateTrack(track.id, { soloed: !track.soloed });
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-900 rounded-lg">
      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex flex-col gap-4 p-4 bg-gray-800 rounded-lg"
          style={{ borderLeft: `4px solid ${track.color}` }}
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 w-48">
              {track.audioBuffer ? (
                <Music className="w-5 h-5 text-gray-400" />
              ) : (
                <Mic className="w-5 h-5 text-gray-400" />
              )}
              <span className="text-gray-200 font-medium">{track.name}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleMuteToggle(track)}
                className={`px-2 py-1 rounded ${
                  track.muted ? 'bg-red-600' : 'bg-gray-700'
                }`}
              >
                M
              </button>
              <button
                onClick={() => handleSoloToggle(track)}
                className={`px-2 py-1 rounded ${
                  track.soloed ? 'bg-green-600' : 'bg-gray-700'
                }`}
              >
                S
              </button>
              {track.audioBuffer && (
                <>
                  <button
                    onClick={() => playTrack(track.id)}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => stopTrack(track.id)}
                    className="p-1 rounded bg-gray-700 hover:bg-gray-600"
                  >
                    <Square className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 flex-1">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={track.volume}
                onChange={(e) => handleVolumeChange(track.id, Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-32">
              <span className="text-gray-400 text-sm">Pan</span>
              <input
                type="range"
                min="-1"
                max="1"
                step="0.01"
                value={track.pan}
                onChange={(e) => handlePanChange(track.id, Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          {track.audioBuffer && (
            <>
              <WaveformDisplay track={track} />
              <EffectsRack track={track} />
            </>
          )}
        </div>
      ))}
    </div>
  );
};