"use server";

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');

export async function getCampusPolls() {
  try {
    const db = new Database(dbPath);
    const rows = db.prepare("SELECT * FROM campus_polls WHERE is_active = 1").all();
    db.close();
    return rows.map((row: any) => ({
      ...row,
      options: JSON.parse(row.options_json || "[]")
    }));
  } catch (error) {
    console.error("Error fetching campus polls:", error);
    return [];
  }
}
