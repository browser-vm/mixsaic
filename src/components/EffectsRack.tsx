import React from 'react';
import { Track } from '../types/track';
import { useAudioStore } from '../store/audioStore';
import { AudioWaveform as Waveform, Clock, Filter } from 'lucide-react';

interface EffectsRackProps {
  track: Track;
}

export const EffectsRack: React.FC<EffectsRackProps> = ({ track }) => {
  const { updateTrackEffect } = useAudioStore();

  return (
    <div className="grid grid-cols-3 gap-4 mt-4 p-4 bg-gray-900 rounded-lg">
      {/* Reverb */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Waveform className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-200">Reverb</span>
          </div>
          <button
            onClick={() => updateTrackEffect(track.id, 'reverb', { enabled: !track.effects.reverb.enabled })}
            className={`px-2 py-1 text-xs rounded ${
              track.effects.reverb.enabled ? 'bg-blue-600' : 'bg-gray-700'
            }`}
          >
            {track.effects.reverb.enabled ? 'On' : 'Off'}
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-400">Decay</label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={track.effects.reverb.decay}
              onChange={(e) => updateTrackEffect(track.id, 'reverb', { decay: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Mix</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.effects.reverb.wet}
              onChange={(e) => updateTrackEffect(track.id, 'reverb', { wet: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Delay */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-200">Delay</span>
          </div>
          <button
            onClick={() => updateTrackEffect(track.id, 'delay', { enabled: !track.effects.delay.enabled })}
            className={`px-2 py-1 text-xs rounded ${
              track.effects.delay.enabled ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            {track.effects.delay.enabled ? 'On' : 'Off'}
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-400">Time</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.effects.delay.delayTime}
              onChange={(e) => updateTrackEffect(track.id, 'delay', { delayTime: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Feedback</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.effects.delay.feedback}
              onChange={(e) => updateTrackEffect(track.id, 'delay', { feedback: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Mix</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={track.effects.delay.wet}
              onChange={(e) => updateTrackEffect(track.id, 'delay', { wet: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-gray-200">Filter</span>
          </div>
          <button
            onClick={() => updateTrackEffect(track.id, 'filter', { enabled: !track.effects.filter.enabled })}
            className={`px-2 py-1 text-xs rounded ${
              track.effects.filter.enabled ? 'bg-green-600' : 'bg-gray-700'
            }`}
          >
            {track.effects.filter.enabled ? 'On' : 'Off'}
          </button>
        </div>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-400">Frequency</label>
            <input
              type="range"
              min="20"
              max="20000"
              step="1"
              value={track.effects.filter.frequency}
              onChange={(e) => updateTrackEffect(track.id, 'filter', { frequency: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Q</label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={track.effects.filter.q}
              onChange={(e) => updateTrackEffect(track.id, 'filter', { q: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Type</label>
            <select
              value={track.effects.filter.type}
              onChange={(e) => updateTrackEffect(track.id, 'filter', { type: e.target.value as BiquadFilterType })}
              className="w-full bg-gray-800 text-gray-200 rounded px-2 py-1 text-xs"
            >
              <option value="lowpass">Low Pass</option>
              <option value="highpass">High Pass</option>
              <option value="bandpass">Band Pass</option>
              <option value="notch">Notch</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};