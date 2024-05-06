import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
    const {ordDate} = req.query;
    // console.log("Received id:", content);
    try {
      const db = await open({
        filename: './my_DB.db',
        driver: sqlite3.Database,
      });

      const query = `
      SELECT *
      FROM ORDERLIST
      WHERE operDesc LIKE '%반제품1%'
      AND ordDate = '${ordDate}'
      UNION
      SELECT *
      FROM ORDERLIST2
      WHERE operDesc LIKE '%반제품1%'
      AND ordDate = '${ordDate}'
      `;
      const queryResult21 = await db.all(query);
      res.status(200).json(queryResult21);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

