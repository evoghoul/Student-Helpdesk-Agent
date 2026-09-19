"use server";

import Database from "better-sqlite3";
import path from "path";

const dbPath = path.resolve(process.cwd(), "../database/student_helpdesk.db");

export async function getCampusLocations() {
  try {
    const db = new Database(dbPath);
    const records = db.prepare("SELECT location_id as id, room_number as name, block as building, floor, type, description, latitude, longitude, features FROM campus_locations ORDER BY room_number ASC").all();
    db.close();
    
    // Parse the features JSON string if it exists
    const parsedRecords = records.map((record: any) => ({
      ...record,
      features: record.features ? JSON.parse(record.features) : []
    }));
    
    return { success: true, data: parsedRecords };
  } catch (error: any) {
    console.error("Error fetching campus locations:", error);
    // Fallback data if DB fails (e.g. on Vercel)
    const fallbackData = [
      { id: 'LOC_MAIN', name: 'N-Block', building: 'Main Block', floor: 'G to 4', type: 'Administrative', description: 'Main administrative and CSE department block', latitude: null, longitude: null, features: [] },
      { id: 'LOC_LIB', name: 'Central Library', building: 'Library', floor: 'G to 2', type: 'Facility', description: '24/7 AC Library with thousands of books', latitude: null, longitude: null, features: [] },
      { id: 'LOC_HOSTEL_A', name: 'Boys Hostel A', building: 'Hostel A', floor: 'G to 5', type: 'Hostel', description: 'First year boys accommodation', latitude: null, longitude: null, features: [] },
      { id: 'LOC_LAB_1', name: 'AI/ML Lab', building: 'N-Block', floor: '3rd Floor', type: 'Academic', description: 'High-performance computing lab equipped with GPUs', latitude: null, longitude: null, features: [] },
      { id: 'LOC_CAFE', name: 'Main Canteen', building: 'Cafeteria', floor: 'Ground', type: 'Food', description: 'Multicuisine food court open till 9 PM', latitude: null, longitude: null, features: [] }
    ];
    return { success: true, data: fallbackData };
  }
}
