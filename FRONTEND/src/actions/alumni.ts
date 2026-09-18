"use server";

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');

export async function getAlumniMentors() {
  try {
    const db = new Database(dbPath);
    const rows = db.prepare("SELECT * FROM alumni_mentors").all();
    db.close();
    return rows;
  } catch (error) {
    console.error("Error fetching alumni mentors:", error);
    return [];
  }
}
