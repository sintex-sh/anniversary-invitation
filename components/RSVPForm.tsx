'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface RSVPFormProps {
  onSuccess: (name: string) => void;
}

export default function RSVPForm({ onSuccess }: RSVPFormProps) {
  const [name, setName] = useState('');
  const [attendance, setAttendance] = useState('Yes');
  const [guests, setGuests] = useState('2');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/rsvps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          status: attendance,
          guests: attendance === 'Yes' ? Number(guests) : 0,
          message
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit RSVP");
      }

      // Confetti fire trigger!
      if (attendance === 'Yes') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f3e5ab', '#d4af37', '#aa7c11', '#ffffff']
        });
      }

      onSuccess(name);
      
      // Clear fields
      setName('');
      setMessage('');
      setAttendance('Yes');
      setGuests('2');
    } catch (error) {
      console.error(error);
      alert("Submission error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-luxury-card backdrop-blur-md border border-luxury-gold/20 rounded-2xl p-8 md:p-12 shadow-gold text-left">
      <h3 className="font-serif text-white text-3xl font-semibold text-center mb-8">
        Kindly RSVP
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name input */}
        <div className="flex flex-col">
          <label className="font-sans text-xs font-semibold tracking-wider text-luxury-gold uppercase mb-2">
            Your Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Abebe & Helen"
            className="bg-white/3 border border-luxury-gold/20 text-white rounded-lg px-4 py-3 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold transition-all"
          />
        </div>

        {/* Radio option fields */}
        <div className="flex flex-col">
          <label className="font-sans text-xs font-semibold tracking-wider text-luxury-gold uppercase mb-2">
            Will You Attend?
          </label>
          <div className="flex gap-4">
            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="attendance"
                value="Yes"
                checked={attendance === 'Yes'}
                onChange={() => setAttendance('Yes')}
                className="sr-only"
              />
              <div className={`border rounded-lg py-3 text-center text-xs font-semibold uppercase tracking-wider transition-all ${attendance === 'Yes' ? 'bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold border-transparent text-neutral-900 shadow-gold' : 'border-luxury-gold/20 text-neutral-400 bg-white/2 hover:border-luxury-gold/50'}`}>
                Joyfully Accept
              </div>
            </label>

            <label className="flex-1 cursor-pointer">
              <input
                type="radio"
                name="attendance"
                value="No"
                checked={attendance === 'No'}
                onChange={() => setAttendance('No')}
                className="sr-only"
              />
              <div className={`border rounded-lg py-3 text-center text-xs font-semibold uppercase tracking-wider transition-all ${attendance === 'No' ? 'bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold border-transparent text-neutral-900 shadow-gold' : 'border-luxury-gold/20 text-neutral-400 bg-white/2 hover:border-luxury-gold/50'}`}>
                Regretfully Decline
              </div>
            </label>
          </div>
        </div>

        {/* Guest counts select */}
        {attendance === 'Yes' && (
          <div className="flex flex-col">
            <label className="font-sans text-xs font-semibold tracking-wider text-luxury-gold uppercase mb-2">
              Number of Guests
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="bg-[#121212] border border-luxury-gold/20 text-white rounded-lg px-4 py-3 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold transition-all"
            >
              <option value="1">1 Person</option>
              <option value="2">2 Persons</option>
              <option value="3">3 Persons</option>
              <option value="4">4 Persons</option>
            </select>
          </div>
        )}

        {/* Congratulatory message */}
        <div className="flex flex-col">
          <label className="font-sans text-xs font-semibold tracking-wider text-luxury-gold uppercase mb-2">
            Message to the Couple
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave a sweet congratulatory note..."
            className="bg-white/3 border border-luxury-gold/20 text-white rounded-lg px-4 py-3 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold text-neutral-900 py-4 rounded-full font-sans font-semibold tracking-widest uppercase text-xs shadow-gold hover:shadow-gold-heavy transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit RSVP'}
        </button>
      </form>
    </div>
  );
}

