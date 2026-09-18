"use server";

import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "../database/student_helpdesk.db");

export async function getEventRegistrations(studentId: string) {
  try {
    const db = new Database(dbPath);
    const records = db.prepare("SELECT * FROM event_registrations WHERE student_id = ?").all(studentId);
    db.close();
    return { success: true, data: records };
  } catch (error: any) {
    console.error("Error fetching event registrations:", error);
    return { success: false, error: error.message };
  }
}

export async function registerForEvent(studentId: string, eventName: string) {
  try {
    const db = new Database(dbPath);
    // Simple mock QR code generation
    const qrCode = `QR_${studentId}_${Date.now()}`;
    const info = db.prepare("INSERT INTO event_registrations (student_id, event_name, qr_code) VALUES (?, ?, ?)")
                   .run(studentId, eventName, qrCode);
    db.close();
    return { success: true, id: info.lastInsertRowid, qrCode };
  } catch (error: any) {
    console.error("Error registering for event:", error);
    return { success: false, error: error.message };
  }
}
