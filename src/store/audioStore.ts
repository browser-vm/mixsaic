import { create } from 'zustand';
import * as Tone from 'tone';
import { AudioState, Track } from '../types/track';

export const useAudioStore = create<AudioState>((set, get) => ({
  tracks: [],
  isPlaying: false,
  currentTime: 0,
  
  addTrack: (track) => 
    set((state) => ({ tracks: [...state.tracks, track] })),
  
  removeTrack: (id) => {
    const track = get().tracks.find(t => t.id === id);
    if (track?.audioSource) {
      track.audioSource.stop().dispose();
    }
    if (track?.analyser) {
      track.analyser.disconnect();
    }
    if (track?.effects) {
      track.effects.reverb.instance?.dispose();
      track.effects.delay.instance?.dispose();
      track.effects.filter.instance?.dispose();
    }
    set((state) => ({ tracks: state.tracks.filter((track) => track.id !== id) }));
  },
  
  updateTrack: (id, updates) =>
    set((state) => ({
      tracks: state.tracks.map((track) =>
        track.id === id ? { ...track, ...updates } : track
      ),
    })),
  
  setIsPlaying: (isPlaying) => {
    if (isPlaying) {
      Tone.start();
      Tone.Transport.start();
    } else {
      Tone.Transport.pause();
    }
    set({ isPlaying });
  },
  
  setCurrentTime: (currentTime) => set({ currentTime }),
  
  loadAudioFile: async (file: File) => {
    await Tone.start();
    
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer);
    
    const player = new Tone.Player(audioBuffer);
    const analyser = Tone.context.createAnalyser();
    analyser.fftSize = 2048;

    // Create effects
    const reverb = new Tone.Reverb({ decay: 1.5, wet: 0.5 });
    const delay = new Tone.FeedbackDelay({ delayTime: 0.25, feedback: 0.3, wet: 0.3 });
    const filter = new Tone.Filter({ frequency: 1000, type: "lowpass", Q: 1 });

    // Connect audio chain
    player.chain(filter, delay, reverb, analyser, Tone.Destination);
    
    const track: Track = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ""),
      volume: 0.8,
      pan: 0,
      muted: false,
      soloed: false,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      audioBuffer,
      audioSource: player,
      analyser,
      startTime: 0,
      duration: audioBuffer.duration,
      effects: {
        reverb: {
          wet: 0.5,
          decay: 1.5,
          enabled: false,
          instance: reverb
        },
        delay: {
          wet: 0.3,
          delayTime: 0.25,
          feedback: 0.3,
          enabled: false,
          instance: delay
        },
        filter: {
          frequency: 1000,
          q: 1,
          type: "lowpass",
          enabled: false,
          instance: filter
        }
      }
    };
    
    get().addTrack(track);
  },
  
  updateTrackEffect: (trackId: string, effectType: string, updates: any) => {
    const track = get().tracks.find(t => t.id === trackId);
    if (!track?.effects) return;

    const effect = track.effects[effectType as keyof typeof track.effects];
    if (!effect || !effect.instance) return;

    // Update effect parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'enabled') {
        effect.enabled = value as boolean;
        if (value) {
          effect.instance.wet.value = effect.wet;
        } else {
          effect.instance.wet.value = 0;
        }
      } else if (key in effect) {
        (effect as any)[key] = value;
        (effect.instance as any)[key].value = value;
      }
    });

    // Update track in store
    get().updateTrack(trackId, {
      effects: {
        ...track.effects,
        [effectType]: effect
      }
    });
  },
  
  playTrack: (id: string) => {
    const track = get().tracks.find(t => t.id === id);
    if (track?.audioSource && !track.muted) {
      track.audioSource.start();
    }
  },
  
  stopTrack: (id: string) => {
    const track = get().tracks.find(t => t.id === id);
    if (track?.audioSource) {
      track.audioSource.stop();
    }
  },
  
  stopAllTracks: () => {
    get().tracks.forEach(track => {
      if (track.audioSource) {
        track.audioSource.stop();
      }
    });
  }
}));