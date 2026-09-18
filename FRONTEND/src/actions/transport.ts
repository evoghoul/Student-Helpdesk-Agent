"use server";

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');

export async function getTransportRoutes() {
  try {
    const db = new Database(dbPath);
    const rows = db.prepare("SELECT * FROM transportation_routes").all();
    db.close();
    return rows;
  } catch (error) {
    console.error("Error fetching transport routes:", error);
    return [];
  }
}
