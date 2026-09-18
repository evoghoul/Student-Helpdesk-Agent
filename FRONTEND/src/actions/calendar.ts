"use server";

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');

export async function fetchStudentSchedule(studentId: string) {
  try {
    const db = new Database(dbPath);
    
    // Fetch events ordered by start time
    const events = db.prepare(`
      SELECT id, title, description, start_time, end_time, type, location 
      FROM calendar_events 
      WHERE student_id = ?
      ORDER BY start_time ASC
    `).all(studentId);
    
    db.close();
    
    return { success: true, events };
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return { success: false, error: "Failed to fetch schedule" };
  }
}
