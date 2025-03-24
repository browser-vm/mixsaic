export interface Track {
  id: string;
  name: string;
  volume: number;
  pan: number;
  muted: boolean;
  soloed: boolean;
  color: string;
  audioBuffer?: AudioBuffer;
  audioSource?: any; // Tone.Player instance
  analyser?: AnalyserNode;
  startTime: number;
  duration: number;
  effects: {
    reverb: {
      wet: number;
      decay: number;
      enabled: boolean;
      instance?: any; // Tone.Reverb
    };
    delay: {
      wet: number;
      delayTime: number;
      feedback: number;
      enabled: boolean;
      instance?: any; // Tone.FeedbackDelay
    };
    filter: {
      frequency: number;
      q: number;
      type: BiquadFilterType;
      enabled: boolean;
      instance?: any; // Tone.Filter
    };
  };
}

export interface AudioState {
  tracks: Track[];
  isPlaying: boolean;
  currentTime: number;
  addTrack: (track: Track) => void;
  removeTrack: (id: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  loadAudioFile: (file: File) => Promise<void>;
  playTrack: (id: string) => void;
  stopTrack: (id: string) => void;
  stopAllTracks: () => void;
  updateTrackEffect: (trackId: string, effect: string, updates: any) => void;
}