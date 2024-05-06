import sqlite3 from 'sqlite3';

export default function handler(req, res) {
  
  const db = new sqlite3.Database('./my_DB.db', sqlite3.OPEN_READONLY, (error) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      db.all('select * from QCLIST where inspStatus <> "RESULTCONF" ', (err, rows) => {
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

