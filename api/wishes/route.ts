import { NextResponse } from 'next/server';
import { getWishes, addWish, approveWish, deleteWish, initDatabase } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeUnapproved = searchParams.get('all') === 'true';
    await initDatabase();
    const wishes = await getWishes(includeUnapproved);
    return NextResponse.json(wishes);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wishes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }
    const newWish = await addWish({
      name: data.name,
      message: data.message,
      approved: false // Moderated by default!
    });
    return NextResponse.json(newWish);
  } catch (error) {
    return NextResponse.json({ error: "Failed to submit wish" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    if (data.id === undefined || data.approved === undefined) {
      return NextResponse.json({ error: "ID and approved status are required" }, { status: 400 });
    }
    await approveWish(Number(data.id), Boolean(data.approved));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update wish status" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await deleteWish(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete wish" }, { status: 500 });
  }
}
