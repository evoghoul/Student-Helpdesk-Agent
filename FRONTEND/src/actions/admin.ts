"use server";

import { getDb } from "../lib/db-provider";



export async function adminLogin(username: string, passwordHash: string) {
  try {
    const db = getDb();
    const stmt = db.prepare(`SELECT * FROM admins WHERE username = ? AND password_hash = ?`);
    const admin = stmt.get(username, passwordHash);
    db.close();

    if (admin) {
      return { success: true, admin };
    }
    return { success: false, error: "Invalid credentials" };
  } catch (error) {
    console.error("Admin login error:", error);
    return { success: false, error: "Database error during login" };
  }
}

import { mockGrievances, mockClubApps, mockBookings, mockLostAndFound } from '../data/adminMockData';

export async function fetchAllTickets() {
  try {
    const db = getDb();
    // Fetch all grievances
    const grievances = db.prepare(`
      SELECT tracking_id as id, description, status, timestamp, withdrawal_reason 
      FROM studentlife_grievance 
      ORDER BY timestamp DESC
    `).all();
    
    // Fetch all club apps
    const clubApps = db.prepare(`
      SELECT id, club_id, student_name, status, timestamp, withdrawal_reason 
      FROM studentlife_club_application 
      ORDER BY timestamp DESC
    `).all();
    
    // Fetch all bookings
    const bookings = db.prepare(`
      SELECT id, facility_id, student_id, date, start_time, end_time, purpose, status 
      FROM bookings 
      ORDER BY date DESC, start_time DESC
    `).all();
    
    // Fetch all lost and found
    const lostAndFound = db.prepare(`
      SELECT id, student_id, type, title, description, tags, contact_info, status, date_posted, image_url 
      FROM lost_and_found 
      ORDER BY date_posted DESC
    `).all();

    db.close();
    
    return { success: true, grievances, clubApps, bookings, lostAndFound };
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    console.log("Falling back to static mock data");
    return { 
      success: true, 
      grievances: mockGrievances, 
      clubApps: mockClubApps, 
      bookings: mockBookings, 
      lostAndFound: mockLostAndFound 
    };
  }
}

export async function updateTicketStatus(ticketId: string | number, type: 'club' | 'grievance' | 'booking' | 'lost_found', newStatus: string) {
  try {
    const db = getDb();
    let stmt;
    
    if (type === 'grievance') {
      stmt = db.prepare(`
        UPDATE studentlife_grievance 
        SET status = ? 
        WHERE tracking_id = ?
      `);
    } else if (type === 'club') {
      stmt = db.prepare(`
        UPDATE studentlife_club_application 
        SET status = ? 
        WHERE id = ?
      `);
    } else if (type === 'booking') {
      stmt = db.prepare(`
        UPDATE bookings 
        SET status = ? 
        WHERE id = ?
      `);
    } else if (type === 'lost_found') {
      stmt = db.prepare(`
        UPDATE lost_and_found 
        SET status = ? 
        WHERE id = ?
      `);
    }
    
    if (stmt) {
      const result = stmt.run(newStatus, ticketId);
      db.close();
      if (result.changes > 0) {
        return { success: true };
      }
      return { success: false, error: "Ticket not found." };
    }
    
    db.close();
    return { success: false, error: "Invalid ticket type." };
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return { success: false, error: "Failed to update ticket" };
  }
}
