"use server";

import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "../database/student_helpdesk.db");

export async function getHostelRequests(studentId: string) {
  try {
    const db = new Database(dbPath);
    const records = db.prepare("SELECT * FROM hostel_requests WHERE student_id = ? ORDER BY created_at DESC").all(studentId);
    db.close();
    return { success: true, data: records };
  } catch (error: any) {
    console.error("Error fetching hostel requests:", error);
    return { success: false, error: error.message };
  }
}

export async function createHostelRequest(studentId: string, type: string, details: string) {
  try {
    const db = new Database(dbPath);
    const info = db.prepare("INSERT INTO hostel_requests (student_id, type, details) VALUES (?, ?, ?)")
                   .run(studentId, type, details);
    db.close();
    return { success: true, id: info.lastInsertRowid };
  } catch (error: any) {
    console.error("Error creating hostel request:", error);
    return { success: false, error: error.message };
  }
}
