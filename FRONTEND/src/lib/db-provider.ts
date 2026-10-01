import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export function getDb() {
  const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  let dbPath = path.resolve(process.cwd(), '../database/student_helpdesk.db');
  
  if (isVercel) {
    dbPath = '/tmp/student_helpdesk.db';
    const bundledPath = path.resolve(process.cwd(), 'student_helpdesk.db');
    
    if (!fs.existsSync(dbPath)) {
      if (fs.existsSync(bundledPath)) {
        fs.copyFileSync(bundledPath, dbPath);
        console.log("Mock Database copied to /tmp successfully for Vercel execution.");
      } else {
        console.warn("Bundled DB not found at", bundledPath);
      }
    }
  }
  
  return new Database(dbPath);
}
