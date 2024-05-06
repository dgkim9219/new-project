import sqlite3 from 'sqlite3';

export default function handler(req, res) {
  const db = new sqlite3.Database('./my_DB.db', sqlite3.OPEN_READONLY, (error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      db.all(`
      SELECT * 
FROM MATERIALMASTER
WHERE "MRP Ctrl" == "100" OR "MRP Ctrl" == "110" OR "MRP Ctrl" == "202"
ORDER BY CASE "MRP Ctrl"
            WHEN '100' THEN 1
            WHEN '110' THEN 2
            WHEN '202' THEN 3
         END;`, (err, rows) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.status(200).json(rows);

        }
      });
    }
  });
  db.close();
}

