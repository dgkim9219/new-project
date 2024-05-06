"use client";

import styles from "../styles/allOrder.module.css";
import * as React from "react";
import { useTable, useFilters } from "react-table";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Table(): JSX.Element {
  const [allOrderTD, setAllOrderTD] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let response_allOrderTD = await axios.get('/api/Query_AllOrderComplete');
      // 데이터 가져올 때 orderCount, semi2Count, fertCount를 정수로 변환
      const modifiedData = response_allOrderTD.data.map((item) => ({
        ...item,
        orderCount: parseInt(item.orderCount).toLocaleString() + " 건",
        semi2Count: parseInt(item.semi2Count).toLocaleString() + " EA",
        fertCount: parseInt(item.fertCount).toLocaleString() + " Kit",
      }));
      setAllOrderTD(modifiedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "생산지시 건수",
        accessor: "orderCount",
      },
      {
        Header: "반제품 지시 수량",
        accessor: "semi2Count",
      },
      {
        Header: "완제품 지시 수량",
        accessor: "fertCount",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: allOrderTD }, useFilters );

  return (
    <div className="App">
      <label>반제품1 진행예정</label>
      <table className={styles.table1} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th className={styles.headerCell} {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.id}
                    className={styles.cell}
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>                                                                              
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
