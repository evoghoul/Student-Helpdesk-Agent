"use server";

import { getDb } from "../lib/db-provider";



export async function getAlumniMentors() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM alumni_mentors").all();
    db.close();
    return rows;
  } catch (error) {
    console.error("Error fetching alumni mentors:", error);
    return [];
  }
}
