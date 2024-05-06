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
      SELECT *
      FROM ORDERLIST
      WHERE ordCmf19 IS NOT NULL
      AND ordDate = '${ordDate}'
      UNION
      SELECT *
      FROM ORDERLIST2
      WHERE ordCmf19 IS NOT NULL
      AND ordDate = '${ordDate}';
      `;
      const queryResult19 = await db.all(query);
      res.status(200).json(queryResult19);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

