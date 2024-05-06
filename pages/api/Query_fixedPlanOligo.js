import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const db = await open({
        filename: './my_DB.db',
        driver: sqlite3.Database,
      });

      const query = `
        SELECT
            row_number() OVER () AS id,
            planNo || ' ' || planCmf4 || ' ' || mstMatCmf2 || ' 일루션' AS title,
            ElutionLot AS start,
            ElutionLot AS end,
            mstMatCmf2,
            '일루션' AS process,
            memo
        FROM
            dgMasterTable
        WHERE
            ElutionLot IS NOT NULL
            AND ElutionLot LIKE '____-__-__'
        
        UNION ALL
        
        SELECT
            row_number() OVER () AS id,
            planNo || ' ' || planCmf4 || ' ' || mstMatCmf2 || ' 농도측정' AS title,
            EpochLot AS start,
            EpochLot AS end,
            mstMatCmf2,
            '농도측정' AS process,
            memo
        FROM
            dgMasterTable
        WHERE
            EpochLot IS NOT NULL
            AND EpochLot LIKE '____-__-__'
        
        UNION ALL
        
        SELECT
            row_number() OVER () AS id,
            planNo || ' ' || planCmf4 || ' ' || mstMatCmf2 || ' PM mono' AS title,
            PmMonoLot AS start,
            PmMonoLot AS end,
            mstMatCmf2,
            'PM mono' AS process,
            memo
        FROM
            dgMasterTable
        WHERE
            PmMonoLot IS NOT NULL
            AND PmMonoLot LIKE '____-__-__'
        
        UNION ALL
        
        SELECT
            row_number() OVER () AS id,
            planNo || ' ' || planCmf4 || ' ' || mstMatCmf2 || ' TOM mono' AS title,
            TomMonoLot AS start,
            TomMonoLot AS end,
            mstMatCmf2,
            'TOM mono' AS process,
            memo
        FROM
            dgMasterTable
        WHERE
            TomMonoLot IS NOT NULL
            AND TomMonoLot LIKE '____-__-__'
        
        UNION ALL
        
        SELECT
            row_number() OVER () AS id,
            planNo || ' ' || planCmf4 || ' ' || mstMatCmf2 || ' OM mono' AS title,
            OmMonoLot AS start,
            OmMonoLot AS end,
            mstMatCmf2,
            'OM mono' AS process,
            memo
        FROM
            dgMasterTable
        WHERE
            OmMonoLot IS NOT NULL
            AND OmMonoLot LIKE '____-__-__'
        
        UNION ALL
        
        SELECT
            row_number() OVER () AS id,
            planNo || ' ' || planCmf4 || ' ' || mstMatCmf2 || ' 소량반제품1' AS title,
            Minisemi1Lot AS start,
            Minisemi1Lot AS end,
            mstMatCmf2,
            '소량반제품1' AS process,
            memo
        FROM
            dgMasterTable
        WHERE
            Minisemi1Lot IS NOT NULL
            AND Minisemi1Lot LIKE '____-__-__'
        
        UNION ALL
        
        SELECT
            row_number() OVER () AS id,
            planNo || ' ' || planCmf4 || ' ' || mstMatCmf2 || ' 반제품1' AS title,
            Semi1Lot AS start,
            Semi1Lot AS end,
            mstMatCmf2,
            '반제품1' AS process,
            memo
        FROM
            dgMasterTable
        WHERE
            Semi1Lot IS NOT NULL
            AND Semi1Lot LIKE '____-__-__'
        
        UNION ALL
        
        SELECT
            row_number() OVER () AS id,
            planNo || ' ' || planCmf4 || ' ' || mstMatCmf2 || ' 반제품2' AS title,
            Semi2Lot AS start,
            Semi2Lot AS end,
            mstMatCmf2,
            '반제품2' AS process,
            memo
        FROM
            dgMasterTable
        WHERE
            Semi2Lot IS NOT NULL
            AND Semi2Lot LIKE '____-__-__';
      `;

      const queryResult = await db.all(query);
      res.status(200).json(queryResult);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
