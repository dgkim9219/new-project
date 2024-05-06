import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export default async function handler(req, res) {
  if (req.method == "GET"){
      // console.log(planNo)
    try {
      const db = await open({
        filename: './my_DB.db',
        driver: sqlite3.Database,
      });

      const query = `
      SELECT 
          ' 완제품 ' || count(*) || ' 종 ' || SUBSTR(SUM(qty), 1, LENGTH(SUM(qty)) - 2) || ' Kits' AS title,
          planDate AS start,
          planDate AS end,
          planDate AS id,
          'sumsum' AS part,
          '##635a8' AS color

      FROM 
          FERTLIST
      GROUP BY 
          planDate

      UNION

      SELECT 
          ' 반제품2 ' || count(*) || ' 종 ' || SUBSTR(SUM(ordQty), 1, LENGTH(SUM(ordQty)) - 2) || ' EA' AS title,
          ordDate AS start,
          ordDate AS end,
	        ordDate AS id,
          'PC' AS part,
          '#ffa500' AS color

      FROM (
          SELECT *
          FROM ORDERLIST
          UNION ALL
          SELECT *
          FROM ORDERLIST2
      ) AS CombinedOrderLists
      WHERE
          ordCmf19 IS NOT NULL
      GROUP BY 
          ordDate

      UNION

      SELECT 
          ' 반제품1 ' || count(*) || ' 종 ' || SUBSTR(SUM(ordQty), 1, LENGTH(SUM(ordQty)) - 2) || ' ML' AS title,
          ordDate AS start,
          ordDate AS end,
          ordDate AS id,
          'IC' AS part,
          '#006400' AS color

      FROM (
          SELECT *
          FROM ORDERLIST
          UNION ALL
          SELECT *
          FROM ORDERLIST2
      ) AS CombinedOrderLists
      WHERE
          operDesc LIKE '%반제품1%'
      GROUP BY 
          ordDate;
      `;
      const queryResult19 = await db.all(query);
      // const queryResult19 = formattedResult.map(item => ({
      //   title: item.title,
      //   start: item.start,
      //   end: item.end,
      //   id: item.id,
      //   part: item.part,
      //   color: item.color,
      //   qty: numberWithCommas(item.total_qty),
      //   ordQty: numberWithCommas(item.total_ordQty),
      // }));

      res.status(200).json(queryResult19);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } 
  // else if(req.method =="POST"){
  //   var {eventId, newStartDate, newEndDate} = req.body;
  //   if (newEndDate == null){
  //     newEndDate=newStartDate;
  //   }
  //   try {
  //     const db = await open({
  //       filename: './my_DB.db',
  //       driver: sqlite3.Database,
  //     });

  //       await db.run(`UPDATE PLANLIST
  //        SET startDate='${newStartDate}', endDate='${newEndDate}'
  //        WHERE id = ${eventId}`);

  //     res.status(200).send("Success");
  //   }catch(error){
  //     console.error(error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // }
}