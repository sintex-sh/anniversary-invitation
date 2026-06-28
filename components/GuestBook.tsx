'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

export interface GuestbookEntry {
  id: number;
  name: string;
  message: string;
  photo_url?: string;
  signature_url: string;
}

export default function GuestBook() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [photo, setPhoto] = useState<string>(''); // base64 photo
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/guestbook');
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const initSignaturePad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    canvas.width = rect?.width || 400;
    canvas.height = 180;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Guide line
    ctx.strokeStyle = 'rgba(212,175,55,0.15)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 40);
    ctx.lineTo(canvas.width - 20, canvas.height - 40);
    ctx.stroke();
    ctx.setLineDash([]); // reset

    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.font = '9px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText("SIGN ABOVE THIS LINE", canvas.width / 2, canvas.height - 15);

    ctxRef.current = ctx;
  };

  const clearSignature = (e?: React.MouseEvent) => {
    e?.preventDefault();
    initSignaturePad();
  };

  const getCoordinates = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height)
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawingRef.current = true;
    const coords = getCoordinates(e.nativeEvent);
    ctxRef.current?.beginPath();
    ctxRef.current?.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();

    const coords = getCoordinates(e.nativeEvent);
    const ctx = ctxRef.current;

    if (ctx) {
      ctx.lineTo(coords.x, coords.y);
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#d4af37';
      ctx.shadowColor = '#f3e5ab';
      ctx.shadowBlur = 3;
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    }
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    setLoading(true);

    try {
      const signatureDataUrl = canvas.toDataURL();

      const response = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          message,
          photo,
          signature: signatureDataUrl
        })
      });

      if (response.ok) {
        alert("Thank you! You have successfully signed the guestbook.");
        setName('');
        setMessage('');
        setPhoto('');
        clearSignature();
        fetchEntries();
      }
    } catch (err) {
      console.error(err);
      alert("Submission error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initSignaturePad();
    fetchEntries();

    window.addEventListener('resize', initSignaturePad);
    return () => window.removeEventListener('resize', initSignaturePad);
  }, []);

  return (
    <div className="w-full max-w-5xl px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-luxury-card backdrop-blur-md border border-luxury-gold/20 rounded-2xl p-8 shadow-gold text-left mb-16">
        <p className="text-neutral-300 text-sm leading-relaxed text-center mb-8">
          Leave a lasting memory. Draw your digital signature in liquid gold ink, upload an optional selfie, and lock it in our memories forever!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label className="font-sans text-xs font-semibold tracking-wider text-luxury-gold uppercase mb-2">
              Your Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Grandma Sarah"
              className="bg-white/3 border border-luxury-gold/20 text-white rounded-lg px-4 py-3 focus:border-luxury-gold focus:outline-none transition-all"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-sans text-xs font-semibold tracking-wider text-luxury-gold uppercase mb-2">
              Signoff Message
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Signed with love..."
              className="bg-white/3 border border-luxury-gold/20 text-white rounded-lg px-4 py-3 focus:border-luxury-gold focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-sans text-xs font-semibold tracking-wider text-luxury-gold uppercase mb-2">
              Draw Your Signature
            </label>
            <div className="border border-luxury-gold/20 rounded-lg overflow-hidden bg-black/60 relative">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-44 block cursor-crosshair touch-none"
              />
            </div>
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={(e) => clearSignature(e)}
                className="flex items-center gap-1.5 border border-neutral-600 text-neutral-400 hover:text-white px-3 py-1.5 rounded text-xs uppercase tracking-wider transition-all"
              >
                <RefreshCw className="w-3 h-3" /> Clear Pad
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="font-sans text-xs font-semibold tracking-wider text-luxury-gold uppercase mb-2">
              Upload Selfie / Photo (Optional)
            </label>
            <label className="border border-dashed border-luxury-gold/20 rounded-lg py-6 flex flex-col items-center justify-center cursor-pointer hover:border-luxury-gold/40 hover:bg-white/1 transition-all">
              <Camera className="w-6 h-6 text-luxury-gold mb-2" />
              <span className="text-neutral-400 text-xs">Click to select photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="sr-only"
              />
            </label>

            {photo && (
              <div className="w-24 h-24 rounded-full border border-luxury-gold overflow-hidden mt-4 mx-auto shadow-gold flex items-center justify-center bg-neutral-900">
                <img src={photo} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-luxury-gold-secondary to-luxury-gold text-neutral-900 py-4 rounded-full font-sans font-semibold tracking-widest uppercase text-xs shadow-gold hover:shadow-gold-heavy transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Signing Guestbook...' : 'Sign Digital Guestbook'}
          </button>
        </form>
      </div>

      {/* Guestbook Shelf View Display */}
      {entries.length > 0 && (
        <div className="w-full flex flex-col items-center">
          <h3 className="font-serif text-white text-2xl font-semibold mb-8 tracking-wider">
            Recent Signatures
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {entries.map((sign) => (
              <div key={sign.id} className="bg-luxury-card border border-luxury-border p-6 rounded-xl flex flex-col items-center text-center shadow-md">
                <div className="w-16 h-16 rounded-full border border-luxury-gold/40 overflow-hidden bg-neutral-800 flex items-center justify-center mb-4 text-luxury-gold font-serif text-lg">
                  {sign.photo_url ? (
                    <img src={sign.photo_url} alt={sign.name} className="w-full h-full object-cover" />
                  ) : (
                    sign.name.charAt(0).toUpperCase()
                  )}
                </div>

                {sign.signature_url && (
                  <img
                    src={sign.signature_url}
                    alt={`${sign.name} signature`}
                    className="h-10 max-w-[120px] object-contain mb-4 filter invert brightness-200"
                  />
                )}

                <span className="font-sans text-xs font-semibold text-white mb-2">
                  {sign.name}
                </span>

                <p className="text-neutral-400 text-xs italic leading-relaxed">
                  “{sign.message}”
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

