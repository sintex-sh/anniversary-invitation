'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50); // 0 to 100
  const [isMuted, setIsMuted] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const arpeggioIndexRef = useRef(0);

  // Soft, beautiful chords progression array (Love Arpeggios)
  const chordProgressions = [
    [130.81, 164.81, 196.00, 246.94, 329.63, 392.00, 493.88], // C major 7
    [110.00, 130.81, 164.81, 196.00, 261.63, 329.63, 392.00], // A minor 7
    [87.31, 130.81, 174.61, 220.00, 261.63, 349.23, 440.00],  // F major 7
    [98.00, 146.83, 196.00, 246.94, 293.66, 392.00, 493.88]   // G7
  ];

  const playRomanticArpeggio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioCtx = audioCtxRef.current;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const playBellNote = (freq: number, delay: number, duration: number) => {
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

      // Volume calculation with mute fallback
      const targetVolume = isMuted ? 0 : (volume / 100) * 0.12;

      gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
      gainNode.gain.linearRampToValueAtTime(targetVolume, audioCtx.currentTime + delay + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime + delay);
      osc.stop(audioCtx.currentTime + delay + duration);
    };

    let delayTime = 0;
    const currentChord = chordProgressions[arpeggioIndexRef.current];

    currentChord.forEach((freq) => {
      playBellNote(freq, delayTime, 2.5);
      delayTime += 0.35;
    });

    const highSparkle = currentChord[Math.floor(Math.random() * currentChord.length)] * 2;
    playBellNote(highSparkle, delayTime + 0.2, 3.0);

    arpeggioIndexRef.current = (arpeggioIndexRef.current + 1) % chordProgressions.length;
  };

  const toggleMusic = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
    } else {
      setIsPlaying(true);
      playRomanticArpeggio();
      synthIntervalRef.current = setInterval(playRomanticArpeggio, 4500);
    }
  };

  useEffect(() => {
    return () => {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-3 bg-black/85 border border-luxury-gold/30 rounded-full px-4 py-2 shadow-gold backdrop-blur-md">
      {/* Play/Pause Button */}
      <button 
        onClick={toggleMusic}
        className={`w-10 h-10 rounded-full flex items-center justify-center border border-luxury-gold transition-all duration-300 ${isPlaying ? 'bg-luxury-gold text-black animate-spin' : 'bg-transparent text-luxury-gold hover:bg-luxury-gold hover:text-black'}`}
        style={{ animationDuration: isPlaying ? '6s' : '0s' }}
        title="Background Music Synth"
      >
        <Music className="w-5 h-5" />
      </button>

      {/* Volume slider controls */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className="text-luxury-gold hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-16 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
        />
      </div>
    </div>
  );
}
