'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onUnlock: () => void;
  targetDateStr: string;
}

export default function LoadingScreen({ onUnlock, targetDateStr }: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fill loader progress bar simulated
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const targetStr = targetDateStr.replace(/-/g, "/"); // compatibility safari
      const targetDate = new Date(targetStr).getTime();
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDateStr]);

  const handleUnlock = () => {
    setIsVisible(false);
    setTimeout(onUnlock, 800); // Allow fade out animation to finish
  };

  const formatNum = (num: number) => num < 10 ? `0${num}` : num;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 bg-[#050505] z-[10000] flex flex-col justify-center items-center px-6 text-center select-none overflow-hidden"
        >
          {/* Decorative luxury rings behind */}
          <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
            <div className="w-[400px] h-[400px] rounded-full border border-luxury-gold animate-pulse"></div>
            <div className="absolute w-[460px] h-[460px] rounded-full border border-luxury-gold/50 rotate-45"></div>
          </div>

          <div className="relative z-10 max-w-xl flex flex-col items-center">
            {/* Elegant SVG Loading Rings */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-10">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="88" 
                  cy="88" 
                  r="75" 
                  stroke="rgba(212, 175, 55, 0.05)" 
                  strokeWidth="2.5" 
                  fill="transparent" 
                />
                <motion.circle 
                  cx="88" 
                  cy="88" 
                  r="75" 
                  stroke="#d4af37" 
                  strokeWidth="2.5" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 75}
                  strokeDashoffset={2 * Math.PI * 75 * (1 - progress / 100)}
                />
              </svg>
              <div className="absolute font-script text-luxury-gold text-5xl drop-shadow-gold">A & H</div>
            </div>

            <h1 className="font-serif text-white text-2xl tracking-[3px] uppercase mb-4">
              Our Milestone Celebration
            </h1>
            
            <p className="font-serif italic text-neutral-400 text-sm max-w-md leading-relaxed mb-8">
              &ldquo;Ten years since our eyes met, and our beautiful story began.&rdquo;
            </p>

            {/* Countdown unit displays */}
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[3px] text-luxury-gold/80 mb-4">
                Time remaining until our 10th anniversary
              </p>
              <div className="flex gap-4">
                {Object.entries(timeLeft).map(([key, value]) => (
                  <div key={key} className="flex flex-col items-center min-w-[60px]">
                    <span className="font-sans text-3xl font-light text-luxury-gold drop-shadow-gold">
                      {formatNum(value)}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 mt-1">
                      {key}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing Unlock button */}
            {progress >= 100 && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={handleUnlock}
                className="bg-gradient-to-r from-luxury-gold-secondary via-luxury-gold to-luxury-gold-secondary text-neutral-900 font-sans font-semibold tracking-[2px] uppercase text-xs px-10 py-4 rounded-full shadow-gold hover:shadow-gold-heavy transform hover:scale-[1.03] transition-all duration-300 active:scale-95"
              >
                Unlock Invitation
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
