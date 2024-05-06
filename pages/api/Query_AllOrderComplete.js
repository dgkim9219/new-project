import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    const {ordDate} = req.query;
    // console.log("Received id:", ordDate);
    try {
      const db = await open({
        filename: './my_DB.db',
        driver: sqlite3.Database,
      });

      const query = `
      SELECT 
          (SELECT COUNT(*) FROM PRODLIST) +
          (SELECT COUNT(*) FROM PRODLIST2) +
          (SELECT COUNT(*) FROM FERTLIST) AS orderCount,
          (SELECT SUM(qty) FROM QTPRODS) +
          (SELECT SUM(qty) FROM QTPRODS2) AS semi2Count,
          (SELECT SUM(qty) FROM FERTLIST) AS fertCount;
      `;
      const queryResult36 = await db.all(query);
      res.status(200).json(queryResult36);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }