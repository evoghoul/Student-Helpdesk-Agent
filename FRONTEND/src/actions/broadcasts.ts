"use server";

import Database from 'better-sqlite3';
import path from 'path';

const getDb = () => {
  const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');
  return new Database(dbPath);
};

export async function getActiveBroadcasts() {
  try {
    const db = getDb();
    const broadcasts = db.prepare('SELECT * FROM broadcast_alerts WHERE is_active = 1 ORDER BY timestamp DESC').all();
    return { success: true, broadcasts };
  } catch (error: any) {
    console.error("Broadcast Fetch Error:", error);
    return { success: false, error: error.message };
  }
}

export async function getAllBroadcasts() {
  try {
    const db = getDb();
    const broadcasts = db.prepare('SELECT * FROM broadcast_alerts ORDER BY timestamp DESC').all();
    return { success: true, broadcasts };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleBroadcastStatus(id: number, isActive: boolean) {
  try {
    const db = getDb();
    db.prepare('UPDATE broadcast_alerts SET is_active = ? WHERE id = ?').run(isActive ? 1 : 0, id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteBroadcast(id: number) {
  try {
    const db = getDb();
    db.prepare('DELETE FROM broadcast_alerts WHERE id = ?').run(id);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createBroadcast(message: string, type: string) {
  try {
    const db = getDb();
    db.prepare('INSERT INTO broadcast_alerts (message, type, is_active) VALUES (?, ?, 1)').run(message, type);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
