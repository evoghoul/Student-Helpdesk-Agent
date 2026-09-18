"use server";

import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "../database/student_helpdesk.db");

export async function getCampusLocations() {
  try {
    const db = new Database(dbPath);
    const records = db.prepare("SELECT location_id as id, room_number as name, block as building, floor, 'Facility' as type, description, latitude, longitude, features FROM campus_locations ORDER BY room_number ASC").all();
    db.close();
    
    // Parse the features JSON string if it exists
    const parsedRecords = records.map((record: any) => ({
      ...record,
      features: record.features ? JSON.parse(record.features) : []
    }));
    
    return { success: true, data: parsedRecords };
  } catch (error: any) {
    console.error("Error fetching campus locations:", error);
    return { success: false, error: error.message };
  }
}
