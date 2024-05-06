import sqlite3 from 'sqlite3';

export default function handler(req, res) {
  const db = new sqlite3.Database('./my_DB.db', sqlite3.OPEN_READONLY, (error) => {
    if (error) {
      console.error('dgSuperEndPointTable Error:',error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      db.all(
        `
        SELECT
        *
        FROM
        dgMasterTable2
        WHERE
        mstMatCmf2 IN ('IC', 'Maker', 'MS2 Phage', 'PC', 'PC1', 'PC2', 'PC3', 'SD', 'WTC')
        `,
          (err, rows) => {
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


