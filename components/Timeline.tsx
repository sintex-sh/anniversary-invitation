'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export interface Milestone {
  id: number;
  date: string;
  title: string;
  desc: string;
  visualSeed: number;
}

interface TimelineProps {
  milestones: Milestone[];
}

export default function Timeline({ milestones }: TimelineProps) {
  // Offline-capable Canvas rendering for unique beautiful custom visuals
  const drawMilestoneVisual = (canvasId: string, seed: number) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width = 300;
    const h = canvas.height = 180;

    // Dark luxury linear gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#121212');
    bgGrad.addColorStop(1, '#050505');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const goldGrad = ctx.createLinearGradient(0, 0, w, h);
    goldGrad.addColorStop(0, '#f3e5ab');
    goldGrad.addColorStop(0.5, '#d4af37');
    goldGrad.addColorStop(1, '#8a660d');

    // Abstract decorative vector rings
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 35 + i * 14 + (seed % 8), 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = goldGrad;
    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 1.5;

    // Custom illustrative shapes per milestone type
    if (seed === 45) { // First Meeting Cafe
      ctx.beginPath();
      ctx.arc(w/2, h/2 + 10, 18, 0, Math.PI, false);
      ctx.lineTo(w/2 - 18, h/2 + 10);
      ctx.fillStyle = 'rgba(212,175,55,0.12)';
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(w/2 + 18, h/2 + 5, 6, -Math.PI/2, Math.PI/2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(243, 229, 171, 0.5)';
      ctx.lineWidth = 2;
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(w/2 + i*6, h/2 - 12);
        ctx.quadraticCurveTo(w/2 + i*6 + 4, h/2 - 18, w/2 + i*6, h/2 - 25);
        ctx.stroke();
      }
    } else if (seed === 88) { // Date streetlamp
      ctx.beginPath();
      ctx.moveTo(w/2, h/2 + 30);
      ctx.lineTo(w/2, h/2 - 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w/2, h/2 - 20, 10, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,175,55,0.2)';
      ctx.fill();
      ctx.stroke();

      // Sparkles
      drawSparkle(ctx, w/2 - 30, h/2 - 5, 8);
      drawSparkle(ctx, w/2 + 35, h/2 - 25, 5);
    } else if (seed === 120) { // Ring
      ctx.beginPath();
      ctx.arc(w/2 - 10, h/2 + 10, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w/2 + 10, h/2 + 10, 14, 0, Math.PI * 2);
      ctx.stroke();

      // Brilliant diamond cut
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(w/2 - 10, h/2 - 6);
      ctx.lineTo(w/2 - 14, h/2 - 12);
      ctx.lineTo(w/2 - 10, h/2 - 18);
      ctx.lineTo(w/2 - 6, h/2 - 12);
      ctx.closePath();
      ctx.fill();
    } else if (seed === 212) { // Wedding hearts
      ctx.fillStyle = 'rgba(212,175,55,0.12)';
      drawHeart(ctx, w/2 - 12, h/2, 20);
      ctx.stroke();
      drawHeart(ctx, w/2 + 12, h/2 - 4, 15);
      ctx.stroke();
    } else if (seed === 330) { // Family star glows
      ctx.beginPath();
      ctx.arc(w/2, h/2, 20, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,175,55,0.08)';
      ctx.fill();
      ctx.stroke();

      drawSparkle(ctx, w/2 - 10, h/2 - 4, 7);
      drawSparkle(ctx, w/2 + 10, h/2 + 4, 10);
    } else { // 10 Year Anniversary
      ctx.font = 'normal 4rem "Alex Brush", cursive, Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = goldGrad;
      ctx.fillText("10", w/2, h/2);
    }

    // Border Frame
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(6, 6, w - 12, h - 12);
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy - size);
    ctx.quadraticCurveTo(cx, cy, cx + size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy + size);
    ctx.quadraticCurveTo(cx, cy, cx - size, cy);
    ctx.quadraticCurveTo(cx, cy, cx, cy - size);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
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

  useEffect(() => {
    milestones.forEach(item => {
      drawMilestoneVisual(`milestone-${item.id}`, item.visualSeed);
    });
  }, [milestones]);

  return (
    <div className="relative w-full max-w-4xl py-10 px-4">
      {/* Centered vertical connector line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-luxury-gold to-transparent -translate-x-1/2 hidden md:block"></div>
      
      {/* Left connector line for mobile devices */}
      <div className="absolute left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-luxury-gold to-transparent md:hidden"></div>

      <div className="space-y-16">
        {milestones.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              transition={{ duration: 0.8, cubicBezier: [0.165, 0.84, 0.44, 1] }}
              className={`flex flex-col md:flex-row items-center relative ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Timeline Connector Dot */}
              <div className="absolute left-6 md:left-1/2 top-4 w-4 h-4 rounded-full bg-luxury-bg border-2 border-luxury-gold shadow-gold -translate-x-1/2 z-10 transition-transform duration-300 hover:scale-125"></div>

              {/* Timeline Item Card */}
              <div className="w-full md:w-[45%] ml-12 md:ml-0">
                <div className="p-8 bg-luxury-card backdrop-blur-md border border-luxury-border rounded-2xl hover:border-luxury-gold/30 hover:shadow-gold transition-all duration-500 text-left">
                  <span className="font-sans text-xs font-semibold tracking-widest text-luxury-gold uppercase block mb-2">
                    {item.date}
                  </span>
                  <h3 className="font-serif text-white text-xl font-semibold mb-4">
                    {item.title}
                  </h3>
                  
                  {/* Visual canvas */}
                  <div className="w-full h-44 rounded-xl overflow-hidden border border-neutral-800/80 mb-4">
                    <canvas id={`milestone-${item.id}`} className="w-full h-full block bg-[#111]"></canvas>
                  </div>

                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Spacing alignment helper */}
              <div className="hidden md:block w-[10%]"></div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
