import { NextResponse } from 'next/server';
import { getRSVPs, addRSVP, deleteRSVP, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase(); // Initialize tables if not exist
    const rsvps = await getRSVPs();
    return NextResponse.json(rsvps);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch RSVPs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.status) {
      return NextResponse.json({ error: "Name and attendance status are required" }, { status: 400 });
    }
    const newRsvp = await addRSVP({
      name: data.name,
      status: data.status,
      guests: Number(data.guests || 1),
      message: data.message || ""
    });
    return NextResponse.json(newRsvp);
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await deleteRSVP(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete RSVP" }, { status: 500 });
  }
}

