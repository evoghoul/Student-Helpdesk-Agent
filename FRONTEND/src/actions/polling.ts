"use server";

import { getDb } from "../lib/db-provider";



export async function getCampusPolls() {
  try {
    const db = getDb();
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
