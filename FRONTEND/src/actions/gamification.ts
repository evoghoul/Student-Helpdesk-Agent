"use server";

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');

export async function getGamificationData(studentId: string) {
  try {
    const db = new Database(dbPath);
    const row = db.prepare("SELECT * FROM gamification WHERE student_id = ?").get(studentId) as any;
    db.close();
    if (row) {
      return {
        points: row.points,
        badges: JSON.parse(row.badges_json || "[]")
      };
    }
    return { points: 0, badges: [] };
  } catch (error) {
    console.error("Error fetching gamification data:", error);
    return { points: 0, badges: [] };
  }
}

