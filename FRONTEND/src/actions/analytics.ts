"use server";

import Database from 'better-sqlite3';
import path from 'path';

const getDb = () => {
  const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');
  return new Database(dbPath);
};

export async function getAnalyticsData() {
  try {
    const db = getDb();
    
    // Grievances by status
    const grievanceStatusCounts = db.prepare(`
      SELECT status as name, COUNT(*) as value
      FROM studentlife_grievance
      GROUP BY status
    `).all();

    // Club apps by status
    const clubStatusCounts = db.prepare(`
      SELECT status as name, COUNT(*) as value
      FROM club_applications
      GROUP BY status
    `).all();

    // Bookings by facility
    const bookingFacilityCounts = db.prepare(`
      SELECT facility_id as name, COUNT(*) as value
      FROM bookings
      GROUP BY facility_id
    `).all();

    return {
      success: true,
      data: {
        grievances: grievanceStatusCounts.length > 0 ? grievanceStatusCounts : [{name: "No Data", value: 0}],
        clubs: clubStatusCounts.length > 0 ? clubStatusCounts : [{name: "No Data", value: 0}],
        bookings: bookingFacilityCounts.length > 0 ? bookingFacilityCounts : [{name: "No Data", value: 0}]
      }
    };
  } catch (error: any) {
    console.error("Analytics Error:", error);
    return { success: false, error: error.message };
  }
}
