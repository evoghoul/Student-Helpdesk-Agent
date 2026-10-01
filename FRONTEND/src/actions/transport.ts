"use server";

import { getDb } from "../lib/db-provider";



export async function getTransportRoutes() {
  try {
    const db = getDb();
    const rows = db.prepare("SELECT * FROM transportation_routes").all();
    db.close();
    return rows;
  } catch (error) {
    console.error("Error fetching transport routes:", error);
    return [];
  }
}
