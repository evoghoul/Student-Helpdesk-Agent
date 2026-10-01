"use server";

import { getDb } from "../lib/db-provider";



export async function getWellnessResources() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM wellness_resources").all();
    db.close();
    return rows;
  } catch (error) {
    console.error("Error fetching wellness resources:", error);
    return [];
  }
}
