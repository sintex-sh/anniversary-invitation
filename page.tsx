'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Calendar, MapPin, Gift, Share2, Heart } from 'lucide-react';

import LoadingScreen from '@/components/LoadingScreen';
import MusicPlayer from '@/components/MusicPlayer';
import Timeline, { Milestone } from '@/components/Timeline';
import Gallery, { Photo } from '@/components/Gallery';
import VideoSection from '@/components/VideoSection';
import RSVPForm from '@/components/RSVPForm';
import WishesSection from '@/components/WishesSection';
import GuestBook from '@/components/GuestBook';

// Event Details Constants
const coupleNames = "Selamawit & Sintayehu";
const anniversaryTitle = "Celebrating 10 Years Since Our Story Began";
const eventDate = "Saturday, September 12, 2026";
const countdownTarget = "2026-09-12 17:00:00";
const venueName = "Grand Ballroom, Amara Luxury Hotel";
const locationDetails = "Bole Road, Addis Ababa, Ethiopia";
const notesText = "Black Tie Elegant (Black, Gold & Emerald themes preferred). Strictly adult RSVP only.";

const milestones: Milestone[] = [
  { id: 1, date: "September 12, 2016", title: "First Meeting", desc: "A chance encounter in a beautiful rooftop café in Addis Ababa. Sintayehu accidentally sat at Selam's table, and a 3-hour conversation bloomed into something eternal.", visualSeed: 45 },
  { id: 2, date: "October 5, 2016", title: "First Date", desc: "A cozy evening stroll under the jacaranda trees, followed by a romantic candlelit dinner. That was the night we knew we wanted to write all our future chapters together.", visualSeed: 88 },
  { id: 3, date: "December 24, 2019", title: "The Proposal", desc: "Under a sparkling canopy of Christmas fairy lights, Sintayehu knelt down and asked the question of a lifetime. Amidst tears of joy and pure love, Selam whispered a beautiful YES.", visualSeed: 120 },
  { id: 4, date: "August 20, 2021", title: "The Wedding Day", desc: "In front of our dearest family and friends, we promised our forevers. A gorgeous luxury celebration filled with gold accents, emotional vows, and a lot of happy dancing.", visualSeed: 212 },
  { id: 5, date: "June 15, 2023", title: "Our Little Miracle", desc: "Our family grew and our hearts doubled in size. The arrival of our baby filled our lives with sweet laughter, adorable baby steps, and an even deeper sense of devotion.", visualSeed: 330 },
  { id: 6, date: "September 12, 2026", title: "The 10-Year Jubilee", desc: "Ten full years since our eyes first met. Through every joy, every triumph, and every shared dream, we stand stronger, deeper in love, and ready for our next decade.", visualSeed: 42 }
];

const photos: Photo[] = [
  { id: 1, title: "Our Wedding Day Portrait", category: "wedding", desc: "Golden hour glow on the grand ballroom balcony.", visualSeed: 105 },
  { id: 2, title: "Cozy Coffee Strolls", category: "early", desc: "Where we first learned each other's favorite stories.", visualSeed: 8 },
  { id: 3, title: "Rooftop Date Nights", category: "early", desc: "Overlooking the beautiful city lights together.", visualSeed: 49 },
  { id: 4, title: "With Our Little Miracle", category: "family", desc: "Pure happiness on our first summer family walk.", visualSeed: 145 },
  { id: 5, title: "Exchange of Rings", category: "wedding", desc: "A timeless token of our everlasting love vows.", visualSeed: 220 },
  { id: 6, title: "First Family Vacation", category: "family", desc: "Splashing in the warm beach shores under golden rays.", visualSeed: 180 }
];

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [personalizedBannerActive, setPersonalizedBannerActive] = useState(false);
  const [rsvpSuccessMessage, setRsvpSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check URL parameters for personalized greeting
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const guest = params.get('guest') || params.get('to');
      if (guest) {
        const cleaned = decodeURIComponent(guest).replace(/_/g, ' ');
        setGuestName(cleaned);
      }
    }
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (guestName) {
      setTimeout(() => {
        setPersonalizedBannerActive(true);
      }, 1000);
    }
  };

  const generateGuestLink = (name: string) => {
    if (typeof window === 'undefined') return '';
    const encoded = encodeURIComponent(name.trim().replace(/\s+/g, '_'));
    return `${window.location.origin}?guest=${encoded}`;
  };

  const handleRsvpSuccess = (name: string) => {
    setRsvpSuccessMessage(`Thank you, ${name}! Your RSVP has been received successfully.`);
    setTimeout(() => {
      setRsvpSuccessMessage(null);
    }, 5000);
  };

  return (
    <>
      {/* 1. Loader screen */}
      <LoadingScreen onUnlock={handleUnlock} targetDateStr={countdownTarget} />

      {/* Floating global music player */}
      {isUnlocked && (
        <div className="fixed top-6 right-6 z-[999]">
          <MusicPlayer />
        </div>
      )}

      {/* Personalized Invitation Banner overlay */}
      <AnimatePresence>
        {personalizedBannerActive && guestName && (
          <motion.div
            initial={{ y: 150, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 150, x: "-50%", opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg p-6 bg-[#141414]/90 backdrop-blur-md border border-luxury-gold/30 rounded-2xl shadow-gold-heavy text-center z-[998]"
          >
            <span className="text-[10px] tracking-widest text-luxury-gold uppercase font-semibold block mb-1">
              Personalized Invitation for
            </span>
            <p className="font-serif text-white text-xl font-medium mb-1">
              {guestName}
            </p>
            <p className="text-neutral-400 text-xs">
              We are so excited to celebrate our beautiful milestone with you.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RSVP Toast alert */}
      <AnimatePresence>
        {rsvpSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-[10001] bg-[#1a1a1a] border-l-4 border-luxury-gold text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3"
          >
            <Heart className="w-5 h-5 text-luxury-gold fill-luxury-gold" />
            <span className="text-sm font-medium">{rsvpSuccessMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App main container content layout */}
      <main className="relative min-h-screen">
        
        {/* LANDING PAGE HERO SECTION */}
        <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden text-center py-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black z-0 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl flex flex-col items-center">
            {/* Elegant Ring visual */}
            <svg className="w-24 h-24 text-luxury-gold animate-float mb-6 drop-shadow-gold" viewBox="0 0 100 100">
              <circle cx="40" cy="50" r="22" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="60" cy="50" r="22" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>

            <span className="border-t border-b border-luxury-gold text-luxury-gold text-[10px] uppercase font-semibold tracking-[4px] px-6 py-1.5 mb-6 block">
              {anniversaryTitle}
            </span>

            <h1 className="font-serif text-white text-5xl md:text-6xl font-bold tracking-wider mb-6 drop-shadow-lg">
              {coupleNames}
            </h1>

            <p className="font-serif italic text-neutral-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
              &ldquo;Ten years of laughter, growth, and unconditional love. We want you to celebrate this milestone with us.&rdquo;
            </p>

            <span className="font-sans text-neutral-100 text-sm font-medium tracking-widest uppercase mb-12">
              {eventDate}
            </span>

            <button 
              onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold text-neutral-900 font-sans font-semibold tracking-widest uppercase text-xs px-12 py-4.5 rounded-full shadow-gold-heavy transform hover:scale-102 hover:-translate-y-0.5 active:translate-y-0 active:scale-100 transition-all duration-300 flex items-center gap-2"
            >
              View Invitation Details
              <Sparkles className="w-3.5 h-3.5 fill-black" />
            </button>
          </div>
        </section>

        {/* OUR STORY TIMELINE SECTION */}
        <section id="journey" className="py-24 bg-gradient-to-b from-black to-neutral-950 text-center relative border-t border-luxury-gold/5">
          <div className="max-w-xl mx-auto mb-16 px-6">
            <span className="text-[10px] tracking-widest text-luxury-gold font-semibold uppercase block mb-2">Our Journey</span>
            <h2 className="font-serif text-white text-3xl md:text-4xl font-semibold">How It All Began</h2>
            <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-6 relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-luxury-gold bg-neutral-950 px-2 text-[8px]">♦</span>
            </div>
          </div>

          <Timeline milestones={milestones} />
        </section>

        {/* PHOTO GALLERY SECTION */}
        <section id="gallery" className="py-24 bg-gradient-to-b from-neutral-950 to-black text-center border-t border-luxury-gold/5">
          <div className="max-w-xl mx-auto mb-16 px-6">
            <span className="text-[10px] tracking-widest text-luxury-gold font-semibold uppercase block mb-2">A Decade of Memories</span>
            <h2 className="font-serif text-white text-3xl md:text-4xl font-semibold">Captured Moments</h2>
            <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-6 relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-luxury-gold bg-black px-2 text-[8px]">♦</span>
            </div>
          </div>

          <Gallery photos={photos} />
        </section>

        {/* VIDEO STORY SECTION */}
        <section id="video-story" className="py-24 bg-gradient-to-b from-black to-neutral-950 text-center flex flex-col items-center px-6 border-t border-luxury-gold/5">
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-[10px] tracking-widest text-luxury-gold font-semibold uppercase block mb-2">Love in Motion</span>
            <h2 className="font-serif text-white text-3xl md:text-4xl font-semibold">Our Video Story</h2>
            <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-6 relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-luxury-gold bg-neutral-950 px-2 text-[8px]">♦</span>
            </div>
          </div>

          <VideoSection />
        </section>

        {/* EVENT DETAILS & LOCATION */}
        <section id="details" className="py-24 bg-gradient-to-b from-neutral-950 to-black text-center flex flex-col items-center px-6 border-t border-luxury-gold/5">
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-[10px] tracking-widest text-luxury-gold font-semibold uppercase block mb-2">Save The Date</span>
            <h2 className="font-serif text-white text-3xl md:text-4xl font-semibold">Celebration Details</h2>
            <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-6 relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-luxury-gold bg-black px-2 text-[8px]">♦</span>
            </div>
          </div>

          {/* Details grid list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-20 text-center">
            {/* When Card */}
            <div className="p-8 bg-luxury-card backdrop-blur-md border border-luxury-border rounded-2xl hover:border-luxury-gold/30 hover:shadow-gold transition-all duration-300 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-luxury-gold flex items-center justify-center mb-6 text-luxury-gold shadow-gold">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-white text-lg font-semibold mb-3">When</h3>
              <p className="text-white text-sm font-medium mb-1">{eventDate}</p>
              <p className="text-neutral-400 text-xs">Reception starts at 5:00 PM</p>
            </div>

            {/* Where Card */}
            <div className="p-8 bg-luxury-card backdrop-blur-md border border-luxury-border rounded-2xl hover:border-luxury-gold/30 hover:shadow-gold transition-all duration-300 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-luxury-gold flex items-center justify-center mb-6 text-luxury-gold shadow-gold">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-white text-lg font-semibold mb-3">Where</h3>
              <p className="text-white text-sm font-medium mb-1">{venueName}</p>
              <p className="text-neutral-400 text-xs">{locationDetails}</p>
            </div>

            {/* Special notes Card */}
            <div className="p-8 bg-luxury-card backdrop-blur-md border border-luxury-border rounded-2xl hover:border-luxury-gold/30 hover:shadow-gold transition-all duration-300 flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border border-luxury-gold flex items-center justify-center mb-6 text-luxury-gold shadow-gold">
                <Gift className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-white text-lg font-semibold mb-3">Special Notes</h3>
              <p className="text-white text-sm font-medium mb-1">Dress Code</p>
              <p className="text-neutral-400 text-xs">{notesText}</p>
            </div>
          </div>

          {/* RSVP FORM COMPONENT */}
          <RSVPForm onSuccess={handleRsvpSuccess} />
        </section>

        {/* WISHES & MEMORIES BOARD */}
        <section id="wishes" className="py-24 bg-gradient-to-b from-black to-neutral-950 text-center flex flex-col items-center border-t border-luxury-gold/5">
          <div className="max-w-xl mx-auto mb-16 px-6">
            <span className="text-[10px] tracking-widest text-luxury-gold font-semibold uppercase block mb-2">Congratulate Us</span>
            <h2 className="font-serif text-white text-3xl md:text-4xl font-semibold">Wishes & Memories</h2>
            <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-6 relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-luxury-gold bg-neutral-950 px-2 text-[8px]">♦</span>
            </div>
          </div>

          <WishesSection />
        </section>

        {/* DIGITAL SIGNATURE GUESTBOOK */}
        <section id="guestbook" className="py-24 bg-gradient-to-b from-neutral-950 to-black text-center flex flex-col items-center border-t border-luxury-gold/5">
          <div className="max-w-xl mx-auto mb-16 px-6">
            <span className="text-[10px] tracking-widest text-luxury-gold font-semibold uppercase block mb-2">Eternal Guest Book</span>
            <h2 className="font-serif text-white text-3xl md:text-4xl font-semibold">Sign Our Guest Book</h2>
            <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-6 relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-luxury-gold bg-black px-2 text-[8px]">♦</span>
            </div>
          </div>

          <GuestBook />
        </section>

        {/* SOCIAL SHARE & LINK GENERATION */}
        <section id="share" className="py-24 bg-gradient-to-b from-black to-neutral-950 text-center flex flex-col items-center px-6 border-t border-luxury-gold/5">
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-[10px] tracking-widest text-luxury-gold font-semibold uppercase block mb-2">Spread The Love</span>
            <h2 className="font-serif text-white text-3xl md:text-4xl font-semibold">Share Invitation</h2>
            <div className="w-16 h-[1px] bg-luxury-gold mx-auto mt-6 relative">
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-luxury-gold bg-neutral-950 px-2 text-[8px]">♦</span>
            </div>
          </div>

          {/* Link generator container card */}
          <div className="w-full max-w-xl bg-luxury-card backdrop-blur-md border border-luxury-border rounded-2xl p-8 shadow-gold text-center">
            <p className="text-neutral-300 text-sm leading-relaxed mb-8">
              Generate a customized, unique link for a friend to greet them by name, or share this digital card instantly on social media!
            </p>

            {/* Social icons row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {['WhatsApp', 'Telegram', 'Facebook'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => {
                    const txt = encodeURIComponent(`We are celebrating 10 years! You are warmly invited to Selamawit & Sintayehu's anniversary milestone: `);
                    const url = encodeURIComponent(window.location.href);
                    let target = "";
                    if (plat === 'WhatsApp') target = `https://api.whatsapp.com/send?text=${txt}%20${url}`;
                    else if (plat === 'Telegram') target = `https://t.me/share/url?url=${url}&text=${txt}`;
                    else target = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    window.open(target, '_blank');
                  }}
                  className="py-4 border border-luxury-gold/20 rounded-xl text-neutral-400 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300 flex flex-col items-center gap-2 text-xs uppercase tracking-wider font-semibold hover:bg-luxury-gold/5"
                >
                  <Share2 className="w-5 h-5 text-luxury-gold" />
                  {plat}
                </button>
              ))}
            </div>

            {/* Input generators */}
            <div className="border-t border-neutral-800/60 pt-6">
              <p className="text-xs uppercase tracking-wider text-luxury-gold font-semibold mb-4 text-left">
                Create Personalized Link
              </p>
              <div className="flex gap-2.5">
                <input
                  type="text"
                  id="share-guest-name"
                  placeholder="Guest Name (e.g. Grandma Sarah)"
                  className="flex-1 bg-white/3 border border-luxury-gold/20 text-white text-sm rounded-lg px-4 py-2.5 focus:border-luxury-gold focus:outline-none"
                />
                <button
                  onClick={() => {
                    const input = document.getElementById('share-guest-name') as HTMLInputElement;
                    if (input && input.value.trim()) {
                      const link = generateGuestLink(input.value);
                      navigator.clipboard.writeText(link).then(() => {
                        alert("Custom guest invitation link copied to clipboard! Share it with them.");
                        input.value = "";
                      });
                    } else {
                      alert("Please enter a guest name first.");
                    }
                  }}
                  className="bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold text-neutral-900 font-sans font-semibold tracking-wider uppercase text-[10px] px-6 rounded-lg shadow-gold transition-all hover:brightness-105 active:scale-95"
                >
                  Generate & Copy
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="py-12 bg-neutral-950 border-t border-luxury-gold/10 text-center text-xs text-neutral-500">
        <p className="font-script text-luxury-gold text-3xl mb-4">A & H</p>
        <p className="font-serif italic mb-6">"Two lives, ten years, a lifetime of love."</p>
        <p className="uppercase tracking-[2px]">Made with Love for Selamawit & Sintayehu anniversary</p>
      </footer>
    </>
  );
}
