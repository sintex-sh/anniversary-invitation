'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, Play, Pause, ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface Photo {
  id: number;
  title: string;
  category: string;
  desc: string;
  visualSeed: number;
}

interface GalleryProps {
  photos: Photo[];
}

export default function Gallery({ photos }: GalleryProps) {
  const [filter, setFilter] = useState('all');
  const [lightboxId, setLightboxId] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isSlideshowRunning, setIsSlideshowRunning] = useState(false);
  const [slideshowProgress, setSlideshowProgress] = useState(0);

  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter photos based on category tab
  const filteredPhotos = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  // Draws stylized custom base64 visual representations for offline consistency
  const drawPhotoPlaceholder = (canvasId: string, item: Photo) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = 320;
    const h = canvas.height = 400;

    // Dark luxury linear gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1a1a1a');
    grad.addColorStop(0.5, '#0a0a0a');
    grad.addColorStop(1, '#121212');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Dynamic graphic lines based on seed
    ctx.strokeStyle = 'rgba(212,175,55,0.06)';
    ctx.lineWidth = 1;
    for (let r = 40; r < 200; r += 25) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r + (item.visualSeed % 10), 0, Math.PI * 2);
      ctx.stroke();
    }

    // Stars & Sparkles
    ctx.fillStyle = 'rgba(212,175,55,0.2)';
    for (let i = 0; i < 8; i++) {
      const sx = ((item.visualSeed * (i + 1) * 37) % (w - 40)) + 20;
      const sy = ((item.visualSeed * (i + 1) * 73) % (h - 40)) + 20;
      drawSparkle(ctx, sx, sy, (i % 3 === 0) ? 5 : 3);
    }

    // Draw categories indicators
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    if (item.category === 'early') {
      ctx.beginPath();
      ctx.moveTo(w/2 - 15, h/2 - 25);
      ctx.lineTo(w/2 + 15, h/2 - 25);
      ctx.lineTo(w/2 - 15, h/2 + 25);
      ctx.lineTo(w/2 + 15, h/2 + 25);
      ctx.closePath();
      ctx.fillStyle = 'rgba(212,175,55,0.1)';
      ctx.fill();
      ctx.stroke();
    } else if (item.category === 'wedding') {
      ctx.beginPath();
      ctx.arc(w/2 - 10, h/2, 20, 0, Math.PI*2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w/2 + 10, h/2, 20, 0, Math.PI*2);
      ctx.stroke();
    } else {
      ctx.fillStyle = 'rgba(212,175,55,0.08)';
      drawHeart(ctx, w/2, h/2 - 5, 20);
      ctx.stroke();
    }

    // Shadowed overlay at the bottom for readability
    const textOverlay = ctx.createLinearGradient(0, h - 80, 0, h);
    textOverlay.addColorStop(0, 'rgba(10,10,10,0)');
    textOverlay.addColorStop(1, 'rgba(10,10,10,0.95)');
    ctx.fillStyle = textOverlay;
    ctx.fillRect(0, h - 120, w, 120);

    // Overlay text titles
    ctx.font = 'normal 1.3rem "Playfair Display", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(item.title, w/2, h - 35);

    ctx.font = 'normal 0.65rem "Montserrat", sans-serif';
    ctx.fillStyle = '#d4af37';
    ctx.fillText(item.category.toUpperCase(), w/2, h - 70);

    // Luxury framing borders
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, w - 20, h - 20);
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.quadraticCurveTo(cx, cy, cx + size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size);
    ctx.quadraticCurveTo(cx, cy, cx - size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(x, y + size/4);
    ctx.quadraticCurveTo(x, y - size/2, x - size/2, y - size/2);
    ctx.quadraticCurveTo(x - size, y - size/2, x - size, y + size/4);
    ctx.quadraticCurveTo(x - size, y + size*0.75, x, y + size);
    ctx.quadraticCurveTo(x + size, y + size*0.75, x + size, y + size/4);
    ctx.quadraticCurveTo(x + size, y - size/2, x + size/2, y - size/2);
    ctx.quadraticCurveTo(x, y - size/2, x, y + size/4);
    ctx.closePath();
    ctx.fill();
  };

  const changeImage = (dir: number) => {
    if (lightboxId === null) return;
    const index = photos.findIndex(p => p.id === lightboxId);
    let nextIdx = index + dir;
    if (nextIdx >= photos.length) nextIdx = 0;
    if (nextIdx < 0) nextIdx = photos.length - 1;
    setLightboxId(photos[nextIdx].id);
    setZoom(1);
    setSlideshowProgress(0);
  };

  const handleZoom = (factor: number) => {
    setZoom(prev => Math.min(Math.max(0.5, prev + factor), 3));
  };

  const toggleSlideshow = () => {
    if (isSlideshowRunning) {
      setIsSlideshowRunning(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setSlideshowProgress(0);
    } else {
      setIsSlideshowRunning(true);
      setSlideshowProgress(0);
    }
  };

  useEffect(() => {
    filteredPhotos.forEach(photo => {
      drawPhotoPlaceholder(`photo-${photo.id}`, photo);
    });
  }, [filteredPhotos, filter]);

  // Slideshow core loop listener
  useEffect(() => {
    if (isSlideshowRunning) {
      progressIntervalRef.current = setInterval(() => {
        setSlideshowProgress(prev => {
          if (prev >= 100) {
            changeImage(1);
            return 0;
          }
          return prev + 2;
        });
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isSlideshowRunning, lightboxId]);

  // Redraw Lightbox canvas details when active photo changes
  useEffect(() => {
    if (lightboxId !== null) {
      const activePhoto = photos.find(p => p.id === lightboxId);
      if (activePhoto) {
        const canvas = document.getElementById('lightbox-photo-canvas') as HTMLCanvasElement;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const w = canvas.width = 600;
            const h = canvas.height = 700;
            
            // Draw high resolution version for lightbox
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, w, h);

            // Large gorgeous concentric circular rings
            ctx.strokeStyle = 'rgba(212,175,55,0.06)';
            ctx.lineWidth = 1.5;
            for (let r = 50; r < 350; r += 35) {
              ctx.beginPath();
              ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
              ctx.stroke();
            }

            // Twinkle stars
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 1;
            for (let i = 0; i < 15; i++) {
              const sx = ((activePhoto.visualSeed * (i + 1) * 31) % (w - 60)) + 30;
              const sy = ((activePhoto.visualSeed * (i + 1) * 61) % (h - 60)) + 30;
              drawSparkle(ctx, sx, sy, 4 + (i % 3));
            }

            // Large Icon Frame
            ctx.lineWidth = 3;
            if (activePhoto.category === 'early') {
              ctx.beginPath();
              ctx.moveTo(w/2 - 30, h/2 - 45);
              ctx.lineTo(w/2 + 30, h/2 - 45);
              ctx.lineTo(w/2 - 30, h/2 + 45);
              ctx.lineTo(w/2 + 30, h/2 + 45);
              ctx.closePath();
              ctx.fillStyle = 'rgba(212,175,55,0.1)';
              ctx.fill();
              ctx.stroke();
            } else if (activePhoto.category === 'wedding') {
              ctx.beginPath();
              ctx.arc(w/2 - 20, h/2, 35, 0, Math.PI*2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(w/2 + 20, h/2, 35, 0, Math.PI*2);
              ctx.stroke();
            } else {
              ctx.fillStyle = 'rgba(212,175,55,0.06)';
              drawHeart(ctx, w/2, h/2 - 10, 35);
              ctx.stroke();
            }

            // Big gorgeous text title
            ctx.font = 'normal 2rem "Playfair Display", Georgia, serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(activePhoto.title, w/2, h - 80);

            // Double border frames
            ctx.strokeStyle = 'rgba(212,175,55,0.25)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(15, 15, w - 30, h - 30);
          }
        }
      }
    }
  }, [lightboxId, photos]);

  const activePhoto = photos.find(p => p.id === lightboxId);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Category selector buttons */}
      <div className="flex gap-2 mb-10 flex-wrap justify-center">
        {['all', 'early', 'wedding', 'family'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wider uppercase border transition-all duration-300 ${filter === cat ? 'bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold border-transparent text-neutral-900 shadow-gold' : 'bg-white/5 border-luxury-gold/15 text-white hover:bg-gradient-to-r hover:from-luxury-gold-secondary hover:to-luxury-gold hover:text-neutral-900'}`}
          >
            {cat === 'all' ? 'All Moments' : `${cat} days`}
          </button>
        ))}
      </div>

      {/* Grid container with standard layouts */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl px-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              key={photo.id}
              onClick={() => setLightboxId(photo.id)}
              className="group aspect-[4/5] relative rounded-2xl overflow-hidden border border-luxury-border shadow-md cursor-pointer hover:border-luxury-gold/35 transition-all duration-300"
            >
              <canvas id={`photo-${photo.id}`} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-left">
                <span className="text-[10px] tracking-widest text-luxury-gold font-sans uppercase font-semibold mb-1">{photo.category}</span>
                <h4 className="font-serif text-white text-lg font-semibold">{photo.title}</h4>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox full screen Modal */}
      <AnimatePresence>
        {lightboxId !== null && activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 z-[10000] flex flex-col items-center justify-center p-4"
          >
            {/* Close */}
            <button 
              onClick={() => { setLightboxId(null); setIsSlideshowRunning(false); }}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Container */}
            <div className="relative max-w-full max-h-[75vh] flex items-center justify-center mb-6">
              {/* Previous arrow */}
              <button 
                onClick={() => changeImage(-1)}
                className="absolute -left-16 hidden md:flex w-12 h-12 rounded-full border border-luxury-gold text-luxury-gold items-center justify-center hover:bg-luxury-gold hover:text-neutral-900 transition-all shadow-gold"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Polaroid Frame Canvas wrapping */}
              <div 
                style={{ transform: `scale(${zoom})` }}
                className="border border-luxury-gold rounded-xl overflow-hidden shadow-gold-heavy max-w-full max-h-full transition-transform duration-300 bg-[#000]"
              >
                <canvas id="lightbox-photo-canvas" className="max-w-[90vw] max-h-[60vh] object-contain" />
              </div>

              {/* Next arrow */}
              <button 
                onClick={() => changeImage(1)}
                className="absolute -right-16 hidden md:flex w-12 h-12 rounded-full border border-luxury-gold text-luxury-gold items-center justify-center hover:bg-luxury-gold hover:text-neutral-900 transition-all shadow-gold"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Title / Captions details */}
            <p className="font-serif text-white text-lg max-w-xl text-center mb-4 px-6">
              <strong>{activePhoto.title}</strong> — {activePhoto.desc}
            </p>

            {/* Interactive Control row */}
            <div className="flex gap-4 items-center mb-4">
              <button 
                onClick={() => handleZoom(0.2)}
                className="px-4 py-2 border border-luxury-gold text-luxury-gold rounded-full text-xs font-semibold tracking-wider hover:bg-luxury-gold hover:text-black transition-all flex items-center gap-1.5"
              >
                <ZoomIn className="w-3.5 h-3.5" /> Zoom In
              </button>
              <button 
                onClick={() => handleZoom(-0.2)}
                className="px-4 py-2 border border-luxury-gold text-luxury-gold rounded-full text-xs font-semibold tracking-wider hover:bg-luxury-gold hover:text-black transition-all flex items-center gap-1.5"
              >
                <ZoomOut className="w-3.5 h-3.5" /> Zoom Out
              </button>
              <button 
                onClick={toggleSlideshow}
                className={`px-6 py-2 border border-luxury-gold rounded-full text-xs font-semibold tracking-wider transition-all flex items-center gap-1.5 ${isSlideshowRunning ? 'bg-luxury-gold text-black shadow-gold' : 'text-luxury-gold hover:bg-luxury-gold hover:text-black'}`}
              >
                {isSlideshowRunning ? <><Pause className="w-3.5 h-3.5" /> Pause Slideshow</> : <><Play className="w-3.5 h-3.5" /> Play Slideshow</>}
              </button>
            </div>

            {/* Slideshow Progress bar line */}
            <div className="w-40 h-[3px] bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold transition-all duration-100 ease-linear"
                style={{ width: `${slideshowProgress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
