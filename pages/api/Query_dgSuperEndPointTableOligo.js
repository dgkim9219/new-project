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
        dgMasterTable
        WHERE
        mstMatCmf2 IN ('8M', 'A MOM', 'A TOM', 'B MOM', 'B TOM', 'BLB', 'DES 05', 'DES 10', 'DNA Extraction Solution', 'DOM', 'LOM', 'MDRe TOM', 'MOM', 'MTBe TOM', 'NC', 'OM', 'PM', 'TOM')
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


