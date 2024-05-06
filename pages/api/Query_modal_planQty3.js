import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    const {planDate} = req.query;
    // console.log("Received id:", content);
    try {
      const db = await open({
        filename: './my_DB.db',
        driver: sqlite3.Database,
      });

      const query = `
      SELECT *
      FROM FERTLIST
      WHERE planDate = '${planDate}'
      `;
      const queryResult20 = await db.all(query);
      res.status(200).json(queryResult20);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

