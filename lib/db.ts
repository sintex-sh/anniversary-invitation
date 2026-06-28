import { sql } from '@vercel/postgres';

export interface RSVP {
  id?: number;
  name: string;
  status: string;
  guests: number;
  message: string;
  created_at?: string;
}

export interface Wish {
  id?: number;
  name: string;
  message: string;
  approved: boolean;
  created_at?: string;
}

export interface GuestbookSign {
  id?: number;
  name: string;
  message: string;
  photo_url?: string;
  signature_url: string;
  created_at?: string;
}

// In-Memory Fallback Store for Local Development if PostgreSQL is not connected yet
let rsvpsFallback: RSVP[] = [
  { id: 1, name: "Amanuel & Bethel", status: "Yes", guests: 2, message: "We wouldn't miss this incredible milestone for anything! See you there!" },
  { id: 2, name: "Solomon K.", status: "Yes", guests: 1, message: "Congratulations! Honored to celebrate a decade of your beautiful journey!" }
];

let wishesFallback: Wish[] = [
  { id: 1, name: "Elias & Tigist", message: "A beautiful love story that inspires all of us! Wishing Selamawit & Sintayehu an incredible 10th anniversary celebration. You two are a match made in heaven!", approved: true },
  { id: 2, name: "Dr. Meron Abebe", message: "Ten years of walking hand in hand, raising a beautiful family, and showing everyone what true commitment looks like. Have a wonderful anniversary celebration!", approved: true }
];

let guestbookFallback: GuestbookSign[] = [
  { id: 1, name: "Grandma Sarah", message: "Signed with infinite love and blessings for your beautiful future years.", signature_url: "" }
];

// Seed tables in PostgreSQL if connected
export async function initDatabase() {
  try {
    // Check if postgres URL is set
    if (!process.env.POSTGRES_URL) {
      console.warn("POSTGRES_URL is not set. Using local mock database fallback.");
      return;
    }

    // Initialize RSVPs Table
    await sql`
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        guests INT NOT NULL,
        message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Initialize Wishes Table
    await sql`
      CREATE TABLE IF NOT EXISTS wishes (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        approved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Initialize Guestbook Table
    await sql`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        photo_url TEXT,
        signature_url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("Database tables initialized successfully in Vercel Postgres.");
  } catch (error) {
    console.error("Failed to initialize database tables:", error);
  }
}

// RSVP Queries
export async function getRSVPs(): Promise<RSVP[]> {
  try {
    if (!process.env.POSTGRES_URL) return rsvpsFallback;
    const { rows } = await sql`SELECT * FROM rsvps ORDER BY id DESC;`;
    return rows as RSVP[];
  } catch (error) {
    console.error("Database query error in getRSVPs:", error);
    return rsvpsFallback;
  }
}

export async function addRSVP(rsvp: RSVP): Promise<RSVP> {
  try {
    if (!process.env.POSTGRES_URL) {
      const newRsvp = { ...rsvp, id: rsvpsFallback.length + 1 };
      rsvpsFallback.unshift(newRsvp);
      return newRsvp;
    }
    const { rows } = await sql`
      INSERT INTO rsvps (name, status, guests, message)
      VALUES (${rsvp.name}, ${rsvp.status}, ${rsvp.guests}, ${rsvp.message})
      RETURNING *;
    `;
    return rows[0] as RSVP;
  } catch (error) {
    console.error("Database insert error in addRSVP:", error);
    const newRsvp = { ...rsvp, id: rsvpsFallback.length + 1 };
    rsvpsFallback.unshift(newRsvp);
    return newRsvp;
  }
}

export async function deleteRSVP(id: number): Promise<boolean> {
  try {
    if (!process.env.POSTGRES_URL) {
      rsvpsFallback = rsvpsFallback.filter(r => r.id !== id);
      return true;
    }
    await sql`DELETE FROM rsvps WHERE id = ${id};`;
    return true;
  } catch (error) {
    console.error("Database delete error in deleteRSVP:", error);
    rsvpsFallback = rsvpsFallback.filter(r => r.id !== id);
    return true;
  }
}

// Wishes Queries
export async function getWishes(includeUnapproved = false): Promise<Wish[]> {
  try {
    if (!process.env.POSTGRES_URL) {
      return includeUnapproved ? wishesFallback : wishesFallback.filter(w => w.approved);
    }
    if (includeUnapproved) {
      const { rows } = await sql`SELECT * FROM wishes ORDER BY id DESC;`;
      return rows as Wish[];
    } else {
      const { rows } = await sql`SELECT * FROM wishes WHERE approved = true ORDER BY id DESC;`;
      return rows as Wish[];
    }
  } catch (error) {
    console.error("Database query error in getWishes:", error);
    return includeUnapproved ? wishesFallback : wishesFallback.filter(w => w.approved);
  }
}

export async function addWish(wish: Wish): Promise<Wish> {
  try {
    if (!process.env.POSTGRES_URL) {
      const newWish = { ...wish, id: wishesFallback.length + 1 };
      wishesFallback.unshift(newWish);
      return newWish;
    }
    const { rows } = await sql`
      INSERT INTO wishes (name, message, approved)
      VALUES (${wish.name}, ${wish.message}, ${wish.approved})
      RETURNING *;
    `;
    return rows[0] as Wish;
  } catch (error) {
    console.error("Database insert error in addWish:", error);
    const newWish = { ...wish, id: wishesFallback.length + 1 };
    wishesFallback.unshift(newWish);
    return newWish;
  }
}

export async function approveWish(id: number, status: boolean): Promise<boolean> {
  try {
    if (!process.env.POSTGRES_URL) {
      wishesFallback = wishesFallback.map(w => w.id === id ? { ...w, approved: status } : w);
      return true;
    }
    await sql`UPDATE wishes SET approved = ${status} WHERE id = ${id};`;
    return true;
  } catch (error) {
    console.error("Database update error in approveWish:", error);
    wishesFallback = wishesFallback.map(w => w.id === id ? { ...w, approved: status } : w);
    return true;
  }
}

export async function deleteWish(id: number): Promise<boolean> {
  try {
    if (!process.env.POSTGRES_URL) {
      wishesFallback = wishesFallback.filter(w => w.id !== id);
      return true;
    }
    await sql`DELETE FROM wishes WHERE id = ${id};`;
    return true;
  } catch (error) {
    console.error("Database delete error in deleteWish:", error);
    wishesFallback = wishesFallback.filter(w => w.id !== id);
    return true;
  }
}

// Guestbook Queries
export async function getGuestbookSigns(): Promise<GuestbookSign[]> {
  try {
    if (!process.env.POSTGRES_URL) return guestbookFallback;
    const { rows } = await sql`SELECT * FROM guestbook ORDER BY id DESC;`;
    return rows as GuestbookSign[];
  } catch (error) {
    console.error("Database query error in getGuestbookSigns:", error);
    return guestbookFallback;
  }
}

export async function addGuestbookSign(sign: GuestbookSign): Promise<GuestbookSign> {
  try {
    if (!process.env.POSTGRES_URL) {
      const newSign = { ...sign, id: guestbookFallback.length + 1 };
      guestbookFallback.unshift(newSign);
      return newSign;
    }
    const { rows } = await sql`
      INSERT INTO guestbook (name, message, photo_url, signature_url)
      VALUES (${sign.name}, ${sign.message}, ${sign.photo_url}, ${sign.signature_url})
      RETURNING *;
    `;
    return rows[0] as GuestbookSign;
  } catch (error) {
    console.error("Database insert error in addGuestbookSign:", error);
    const newSign = { ...sign, id: guestbookFallback.length + 1 };
    guestbookFallback.unshift(newSign);
    return newSign;
  }
}

