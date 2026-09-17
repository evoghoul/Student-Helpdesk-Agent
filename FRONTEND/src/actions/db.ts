"use server";

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');

export async function submitAncComplaint(complaintText: string) {
  try {
    const db = new Database(dbPath);
    const trackingId = `ANC-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const stmt = db.prepare(`
      INSERT INTO studentlife_grievance (tracking_id, description, status) 
      VALUES (?, ?, ?)
    `);
    
    stmt.run(trackingId, complaintText, 'Received & Secured');
    db.close();
    
    return { success: true, trackingId };
  } catch (error) {
    console.error("Error submitting complaint:", error);
    return { success: false, error: "Failed to submit complaint" };
  }
}

export async function trackComplaint(trackingId: string) {
  try {
    const db = new Database(dbPath);
    const stmt = db.prepare(`SELECT * FROM studentlife_grievance WHERE tracking_id = ?`);
    const result = stmt.get(trackingId);
    db.close();
    
    if (result) {
      return { success: true, data: result };
    }
    return { success: false, error: "Tracking ID not found." };
  } catch (error) {
    console.error("Error tracking complaint:", error);
    return { success: false, error: "Failed to track complaint" };
  }
}

export async function submitClubApplication(clubId: string, studentName: string) {
  try {
    const db = new Database(dbPath);
    
    const stmt = db.prepare(`
      INSERT INTO studentlife_club_application (club_id, student_name, status) 
      VALUES (?, ?, ?)
    `);
    
    stmt.run(clubId, studentName, 'Application Forwarded');
    db.close();
    
    // Simulate forwarding to WhatsApp/Email
    const logMsg = `[SIMULATION] Forwarded application for ${studentName} to Club ${clubId} Head via WhatsApp/Email.`;
    console.log(logMsg);
    
    return { success: true, message: logMsg };
  } catch (error) {
    console.error("Error submitting club application:", error);
    return { success: false, error: "Failed to submit application" };
  }
}

export async function fetchStudentDbActivity() {
  try {
    const db = new Database(dbPath);
    const complaints = db.prepare(`SELECT tracking_id as id, description, status, timestamp FROM studentlife_grievance ORDER BY timestamp DESC`).all();
    const clubApps = db.prepare(`SELECT id, club_id, status, timestamp FROM studentlife_club_application ORDER BY timestamp DESC`).all();
    db.close();
    
    return { success: true, complaints, clubApps };
  } catch (error) {
    console.error("Error fetching db activity:", error);
    return { success: false, error: "Failed to fetch DB activity" };
  }
}
