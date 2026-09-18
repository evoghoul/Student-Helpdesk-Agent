"use server";

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');

export async function submitAncComplaint(complaintText: string, studentId: string) {
  try {
    const db = new Database(dbPath);
    const trackingId = `ANC-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const stmt = db.prepare(`
      INSERT INTO studentlife_grievance (tracking_id, description, status, student_id) 
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(trackingId, complaintText, 'Received & Secured', studentId);
    db.close();
    
    return { success: true, trackingId };
  } catch (error) {
    console.error("Error submitting complaint:", error);
    return { success: false, error: "Failed to submit complaint" };
  }
}

export async function trackComplaint(trackingId: string, studentId: string) {
  try {
    const db = new Database(dbPath);
    const stmt = db.prepare(`SELECT * FROM studentlife_grievance WHERE tracking_id = ? AND student_id = ?`);
    const result = stmt.get(trackingId, studentId);
    db.close();
    
    if (result) {
      return { success: true, data: result };
    }
    return { success: false, error: "Tracking ID not found or unauthorized." };
  } catch (error) {
    console.error("Error tracking complaint:", error);
    return { success: false, error: "Failed to track complaint" };
  }
}

export async function submitClubApplication(clubId: string, studentName: string, studentId: string) {
  try {
    const db = new Database(dbPath);
    
    const stmt = db.prepare(`
      INSERT INTO studentlife_club_application (club_id, student_name, status, student_id) 
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(clubId, studentName, 'Application Forwarded', studentId);
    db.close();
    
    // Simulate forwarding to WhatsApp/Email
    const logMsg = `[SIMULATION] Forwarded application for ${studentName} (${studentId}) to Club ${clubId} Head via WhatsApp/Email.`;
    console.log(logMsg);
    
    return { success: true, message: logMsg };
  } catch (error) {
    console.error("Error submitting club application:", error);
    return { success: false, error: "Failed to submit application" };
  }
}

export async function withdrawTicket(ticketId: string, type: 'club' | 'grievance', reason: string, studentId: string) {
  try {
    const db = new Database(dbPath);
    let stmt;
    
    if (type === 'grievance') {
      stmt = db.prepare(`
        UPDATE studentlife_grievance 
        SET status = 'Withdrawn', withdrawal_reason = ? 
        WHERE tracking_id = ? AND student_id = ?
      `);
    } else if (type === 'club') {
      stmt = db.prepare(`
        UPDATE studentlife_club_application 
        SET status = 'Withdrawn', withdrawal_reason = ? 
        WHERE id = ? AND student_id = ?
      `);
    }
    
    if (stmt) {
      const result = stmt.run(reason, ticketId, studentId);
      db.close();
      if (result.changes > 0) {
        return { success: true };
      }
      return { success: false, error: "Ticket not found or unauthorized." };
    }
    
    db.close();
    return { success: false, error: "Invalid ticket type." };
  } catch (error) {
    console.error("Error withdrawing ticket:", error);
    return { success: false, error: "Failed to withdraw ticket" };
  }
}

export async function fetchStudentDbActivity(studentId: string) {
  try {
    const db = new Database(dbPath);
    const complaints = db.prepare(`SELECT tracking_id as id, description, status, timestamp, withdrawal_reason FROM studentlife_grievance WHERE student_id = ? ORDER BY timestamp DESC`).all(studentId);
    const clubApps = db.prepare(`SELECT id, club_id, status, timestamp, withdrawal_reason FROM studentlife_club_application WHERE student_id = ? ORDER BY timestamp DESC`).all(studentId);
    db.close();
    
    return { success: true, complaints, clubApps };
  } catch (error) {
    console.error("Error fetching db activity:", error);
    return { success: false, error: "Failed to fetch DB activity" };
  }
}

