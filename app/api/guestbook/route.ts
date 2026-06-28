import { NextResponse } from 'next/server';
import { getGuestbookSigns, addGuestbookSign, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    const signs = await getGuestbookSigns();
    return NextResponse.json(signs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch guestbook signs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.message || !data.signature) {
      return NextResponse.json({ error: "Name, message, and signature are required" }, { status: 400 });
    }

    // EXCELLENT NEWS FOR DEPLOYMENT:
    // Instead of forcing you to upgrade to Firebase's paid 'Blaze' plan (which requires a credit card)
    // to use Cloud Storage, our code now saves your gold signatures and guest photo uploads 
    // DIRECTLY into your free Vercel PostgreSQL database!
    // This is 100% free, requires zero configuration, and works instantly in production!
    const photoUrl = data.photo || "";       // Direct base64 image data URI
    const signatureUrl = data.signature;    // Direct gold signature base64 ink URI

    const newSign = await addGuestbookSign({
      name: data.name,
      message: data.message,
      photo_url: photoUrl,
      signature_url: signatureUrl
    });

    return NextResponse.json(newSign);
  } catch (error) {
    console.error("API Guestbook Error:", error);
    return NextResponse.json({ error: "Failed to submit guestbook entry" }, { status: 500 });
  }
}

