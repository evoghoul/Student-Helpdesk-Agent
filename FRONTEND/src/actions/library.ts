"use server";

import { getDb } from "../lib/db-provider";



export async function getLibraryResources() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM library_resources ORDER BY id DESC").all();
    db.close();
    return rows;
  } catch (error) {
    console.error("Error fetching library resources:", error);
    return [];
  }
}
