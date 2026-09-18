"use server";

import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "../database/student_helpdesk.db");

export async function getMarketplaceListings() {
  try {
    const db = new Database(dbPath);
    const records = db.prepare("SELECT * FROM marketplace_listings ORDER BY created_at DESC").all();
    db.close();
    return { success: true, data: records };
  } catch (error: any) {
    console.error("Error fetching marketplace listings:", error);
    return { success: false, error: error.message };
  }
}

export async function createMarketplaceListing(studentId: string, title: string, category: string, price: number) {
  try {
    const db = new Database(dbPath);
    const info = db.prepare("INSERT INTO marketplace_listings (student_id, title, category, price) VALUES (?, ?, ?, ?)")
                   .run(studentId, title, category, price);
    db.close();
    return { success: true, id: info.lastInsertRowid };
  } catch (error: any) {
    console.error("Error creating marketplace listing:", error);
    return { success: false, error: error.message };
  }
}
