'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface VideoSectionProps {
  customTitle?: string;
}

export default function VideoSection({ customTitle = "A Decade in 3 Minutes" }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const cinematicScenes = [
    { text: "September 2016", desc: "A chance hello..." },
    { text: "Under City Lights", desc: "Talking for hours and hours" },
    { text: "Christmas Eve 2019", desc: "She said YES!" },
    { text: "August 2021", desc: "Two hearts bound as one" },
    { text: "A Baby's Smile", desc: "Our family tree grows" },
    { text: "Happy 10th Anniversary", desc: "To many more beautiful years together!" }
  ];

  const drawSparkle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.quadraticCurveTo(cx, cy, cx + size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size);
    ctx.quadraticCurveTo(cx, cy, cx - size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.stroke();
  };

  const drawVideoThumbnail = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width = 800;
    const h = canvas.height = 450;

    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Conic rings outline
    ctx.strokeStyle = 'rgba(212,175,55,0.08)';
    ctx.lineWidth = 1;
    for (let r = 50; r < 350; r += 45) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // High quality font titles
    ctx.font = 'normal 4rem "Alex Brush", cursive';
    ctx.fillStyle = '#d4af37';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Our Decades of Love", w/2, h/2);

    ctx.strokeStyle = 'rgba(212,175,55,0.25)';
    ctx.strokeRect(20, 20, w - 40, h - 40);
  };

  const animateVideoCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    timeRef.current += 0.016; // Increment by Roughly 60fps delta
    const elapsed = timeRef.current;

    const sceneIndex = Math.floor((elapsed / 3) % cinematicScenes.length);
    const scenePercent = (elapsed % 3) / 3;
    const scene = cinematicScenes[sceneIndex];

    // Background clearing
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, w, h);

    // Glowing overlapping rings breathing
    const breathingRadius = 90 + Math.sin(elapsed * 2) * 12;
    ctx.strokeStyle = 'rgba(212,175,55,0.12)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w/2 - 25, h/2 - 15, breathingRadius, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w/2 + 25, h/2 - 15, breathingRadius, 0, Math.PI*2);
    ctx.stroke();

    // Star twinklers
    ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.sin(elapsed * 4) * 0.3})`;
    drawSparkle(ctx, 100, 120, 7);
    drawSparkle(ctx, w - 120, 100, 11);
    drawSparkle(ctx, 160, 300, 5);
    drawSparkle(ctx, w - 150, 330, 9);

    // Fade in text triggers
    let textAlpha = 0;
    if (scenePercent < 0.2) {
      textAlpha = scenePercent / 0.2;
    } else if (scenePercent > 0.8) {
      textAlpha = (1 - scenePercent) / 0.2;
    } else {
      textAlpha = 1;
    }

    ctx.textAlign = 'center';

    // Scene Title
    ctx.font = 'normal 1.3rem "Montserrat", sans-serif';
    ctx.fillStyle = `rgba(212, 175, 55, ${textAlpha})`;
    ctx.fillText(scene.text.toUpperCase(), w/2, h/2 + 65);

    // Scene Description
    ctx.font = 'normal 2.2rem "Playfair Display", Georgia, serif';
    ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
    ctx.fillText(scene.desc, w/2, h/2 + 110);

    // Film grain overlay filter
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`;
    ctx.fillRect(0, 0, w, h);

    // Progress timeline bar
    ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.fillRect(0, h - 8, w * (elapsed / (cinematicScenes.length * 3) % 1), 8);

    animationFrameRef.current = requestAnimationFrame(animateVideoCanvas);
  };

  const handlePlayToggle = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    } else {
      setIsPlaying(true);
      timeRef.current = 0;
      animateVideoCanvas();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      drawVideoThumbnail(canvas);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-4xl aspect-[16/9] relative rounded-2xl overflow-hidden border border-luxury-border shadow-gold hover:shadow-gold-heavy transition-all duration-500 bg-[#050505]">
      {/* Play state controller layout overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40">
          <button 
            onClick={handlePlayToggle}
            className="w-20 h-20 bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold rounded-full flex items-center justify-center shadow-gold-heavy hover:scale-110 active:scale-95 transition-transform duration-300"
            aria-label="Play Video"
          >
            <Play className="w-8 h-8 fill-black text-black ml-1.5" />
          </button>
          <span className="text-white font-serif mt-5 text-lg font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {customTitle}
          </span>
        </div>
      )}

      {/* Playing pause button overlay */}
      {isPlaying && (
        <button 
          onClick={handlePlayToggle}
          className="absolute bottom-6 right-6 z-20 w-10 h-10 rounded-full border border-luxury-gold/50 text-luxury-gold bg-black/60 flex items-center justify-center hover:bg-luxury-gold hover:text-black transition-colors"
        >
          <Pause className="w-4 h-4 fill-currentColor" />
        </button>
      )}

      {/* Output Screen */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

