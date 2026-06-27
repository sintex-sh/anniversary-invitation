'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Wish {
  id: number;
  name: string;
  message: string;
  created_at?: string;
}

export default function WishesSection() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchWishes = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wishes');
      if (response.ok) {
        const data = await response.json();
        setWishes(data);
      }
    } catch (error) {
      console.error("Failed to fetch wishes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message })
      });

      if (response.ok) {
        alert("Your wish has been submitted! It will appear on the wall after the couple approves it.");
        setName('');
        setMessage('');
        fetchWishes(); // Refresh list (though it might not show unapproved ones, it's good practice)
      }
    } catch (error) {
      console.error(error);
      alert("Submission error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  return (
    <div className="w-full max-w-5xl px-4 flex flex-col items-center">
      {/* Wishes Scrolling Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
        <AnimatePresence mode="popLayout">
          {wishes.map((wish) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={wish.id}
              className="p-8 bg-luxury-card backdrop-blur-md border border-luxury-border rounded-2xl text-left relative overflow-hidden"
            >
              <span className="absolute top-2 right-6 font-serif text-[6.5rem] text-luxury-gold/5 leading-none pointer-events-none select-none">
                &ldquo;
              </span>
              <span className="font-serif text-lg font-semibold text-luxury-gold block mb-3">
                {wish.name}
              </span>
              <p className="text-neutral-300 text-sm italic leading-relaxed">
                &ldquo;{wish.message}&rdquo;
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {wishes.length === 0 && !loading && (
        <p className="text-neutral-500 italic text-sm mb-10">No public congratulations yet. Be the first to leave one!</p>
      )}

      {/* Leave a wish form */}
      <div className="w-full max-w-xl p-8 bg-luxury-card/50 backdrop-blur-md border border-luxury-border rounded-2xl text-left">
        <h4 className="font-serif text-white text-xl font-medium mb-6 text-center">
          Leave a Congratulatory Wish
        </h4>
        <form onSubmit={handleWishSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-sans text-[10px] tracking-wider text-luxury-gold font-semibold uppercase mb-1.5">
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="bg-white/3 border border-luxury-gold/15 text-white rounded-lg px-4 py-2.5 focus:border-luxury-gold focus:outline-none transition-all text-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-sans text-[10px] tracking-wider text-luxury-gold font-semibold uppercase mb-1.5">
              Message
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Congratulations on 10 beautiful years..."
              className="bg-white/3 border border-luxury-gold/15 text-white rounded-lg px-4 py-2.5 focus:border-luxury-gold focus:outline-none transition-all text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold text-neutral-900 py-3.5 rounded-full font-sans font-semibold tracking-wider uppercase text-[10px] shadow-gold hover:shadow-gold-heavy transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {submitting ? 'Sending...' : 'Send Public Wish'}
          </button>
        </form>
      </div>
    </div>
  );
}
