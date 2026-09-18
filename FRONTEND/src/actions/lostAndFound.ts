"use server";

import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');

export async function fetchLostAndFoundItems(filterType: 'all' | 'lost' | 'found' = 'all') {
  try {
    const db = new Database(dbPath);
    let query = `SELECT * FROM lost_and_found WHERE status = 'open'`;
    const params = [];
    
    if (filterType !== 'all') {
      query += ` AND type = ?`;
      params.push(filterType);
    }
    
    query += ` ORDER BY date_posted DESC`;
    
    const items = db.prepare(query).all(...params);
    db.close();
    
    return { success: true, items };
  } catch (error) {
    console.error("Error fetching lost and found items:", error);
    return { success: false, error: "Failed to fetch items" };
  }
}

export async function reportLostAndFoundItem(
  studentId: string, 
  type: 'lost' | 'found', 
  title: string, 
  description: string, 
  tags: string, 
  contactInfo: string,
  imageUrl?: string
) {
  try {
    const db = new Database(dbPath);
    const datePosted = new Date().toISOString();
    
    // If no image is provided, use a default placeholder depending on type
    const finalImageUrl = imageUrl || (type === 'lost' 
      ? 'https://images.unsplash.com/photo-1584483756281-06716bc75eb2?w=400&q=80' // default lost image (maybe a question mark or empty)
      : 'https://images.unsplash.com/photo-1614275141010-90fb49f39446?w=400&q=80'); // default found image
    
    const result = db.prepare(`
      INSERT INTO lost_and_found (student_id, type, title, description, tags, contact_info, status, date_posted, image_url)
      VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?)
    `).run(studentId, type, title, description, tags, contactInfo, datePosted, finalImageUrl);
    
    db.close();
    return { success: true, id: result.lastInsertRowid };
  } catch (error) {
    console.error("Error reporting item:", error);
    return { success: false, error: "Failed to report item" };
  }
}

export async function claimLostAndFoundItem(itemId: number, studentId: string) {
  try {
    const db = new Database(dbPath);
    
    const item: any = db.prepare(`SELECT * FROM lost_and_found WHERE id = ?`).get(itemId);
    
    if (!item) {
      db.close();
      return { success: false, error: "Item not found" };
    }

    db.prepare(`
      UPDATE lost_and_found 
      SET status = 'claimed' 
      WHERE id = ?
    `).run(itemId);
    
    db.close();
    
    // Simulating sending a notification / email here
    console.log(`Notification: Student ${studentId} claimed item ${itemId} (${item.title}). Contacting ${item.contact_info}.`);
    
    return { success: true };
  } catch (error) {
    console.error("Error claiming item:", error);
    return { success: false, error: "Failed to claim item" };
  }
}
