"use server";

import Database from "better-sqlite3";
import { revalidatePath } from "next/cache";

const db = new Database("../database/student_helpdesk.db");

export interface Facility {
  id: number;
  name: string;
  type: string;
  description: string;
  capacity: number;
  image_url: string;
}

export interface Booking {
  id: number;
  facility_id: number;
  student_id: string;
  date: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: string;
}

export async function getFacilities(): Promise<Facility[]> {
  try {
    const stmt = db.prepare("SELECT * FROM facilities");
    return stmt.all() as Facility[];
  } catch (error) {
    console.error("Failed to fetch facilities:", error);
    return [];
  }
}

export async function getBookingsForFacility(facilityId: number, date: string): Promise<Booking[]> {
  try {
    const stmt = db.prepare("SELECT * FROM bookings WHERE facility_id = ? AND date = ? AND status = 'confirmed'");
    return stmt.all(facilityId, date) as Booking[];
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return [];
  }
}

export async function createBooking(data: {
  facility_id: number;
  student_id: string;
  date: string;
  start_time: string;
  end_time: string;
  purpose: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // Check for double booking
    const checkStmt = db.prepare(`
      SELECT * FROM bookings 
      WHERE facility_id = ? 
      AND date = ? 
      AND status = 'confirmed'
      AND (
        (start_time <= ? AND end_time > ?) OR
        (start_time < ? AND end_time >= ?) OR
        (start_time >= ? AND end_time <= ?)
      )
    `);
    
    // We pass the start/end times appropriately to find any overlap
    const existing = checkStmt.get(
      data.facility_id, 
      data.date, 
      data.start_time, data.start_time, // overlap checking
      data.end_time, data.end_time,     // overlap checking
      data.start_time, data.end_time    // overlap checking
    );

    if (existing) {
      return { success: false, message: "Time slot is already booked." };
    }

    const insertStmt = db.prepare(`
      INSERT INTO bookings (facility_id, student_id, date, start_time, end_time, purpose)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertStmt.run(
      data.facility_id,
      data.student_id,
      data.date,
      data.start_time,
      data.end_time,
      data.purpose
    );

    revalidatePath("/");
    return { success: true, message: "Booking confirmed!" };
  } catch (error) {
    console.error("Failed to create booking:", error);
    return { success: false, message: "Failed to create booking. Please try again." };
  }
}
