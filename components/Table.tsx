"use client";

import styles from "../styles/table.module.scss";
import * as React from "react";
import { useTable, useFilters, useGlobalFilter } from "react-table";
import { useState, useEffect } from "react";
import axios from "axios";


export default function Table(): JSX.Element {
  const [dgSEPTD, setDgSEPTD] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumnName, setSelectedColumnName] = useState(null); // To store data of selected cell
  const [selectedPlanNo, setSelectedPlanNo] = useState(null); // To store selected planNo
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal open/close state
  const [inputValue, setInputValue] = useState(''); // To store input field value


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/Query_dgSuperEndPointTable");
      const modifiedData = response.data.map((item) => ({
        ...item,
        MatCmf1: item.MatCmf1 ? item.MatCmf1.replace(/,/g, '\n') : item.MatCmf1,
        mstMatCmf2: item.mstMatCmf2 ? item.mstMatCmf2.replace(/,/g, '\n') : item.mstMatCmf2,
        Qty: item.Qty ? item.Qty.replace(/,/g, '\n') : item.Qty,
        Elution: item.Elution ? item.Elution.replace(/,/g, '\n') : item.Elution,
        Epoch: item.Epoch ? item.Epoch.replace(/,/g, '\n') : item.Epoch,
        PmMono: item.PmMono ? item.PmMono.replace(/,/g, '\n') : item.PmMono,
        TomMono: item.TomMono ? item.TomMono.replace(/,/g, '\n') : item.TomMono,
        OmMono: item.OmMono ? item.OmMono.replace(/,/g, '\n') : item.OmMono,
        Minisemi1: item.Minisemi1 ? item.Minisemi1.replace(/,/g, '\n') : item.Minisemi1,
        Semi1: item.Semi1 ? item.Semi1.replace(/,/g, '\n') : item.Semi1,
        Semi2: item.Semi2 ? item.Semi2.replace(/,/g, '\n') : item.Semi2,
        halbDate: item.halbDate ? item.halbDate.replace(/,/g, '\n') : item.halbDate
      }));
      setDgSEPTD(modifiedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "생산지시번호",
        accessor: "planNo",
      },
      {
        Header: "cat.no",
        accessor: "MatCmf1",
      },
      {
        Header: "구성품",
        accessor: "mstMatCmf2",
      },
      {
        Header: "수량",
        accessor: "Qty",
      },
      {
        Header: "Elution",
        accessor: "ElutionLot",
      },
      {
        Header: "농도측정",
        accessor: "EpochLot",
      },
      {
        Header: "PM mono",
        accessor: "PmMonoLot",
      },
      {
        Header: "TOM mono",
        accessor: "TomMonoLot",
      },
      {
        Header: "OM mono",
        accessor: "OmMonoLot",
      },
      {
        Header: "소량생산 반제품1",
        accessor: "Minisemi1Lot",
      },
      {
        Header: "반제품1",
        accessor: "Semi1Lot",
      },
      {
        Header: "반제품2",
        accessor: "Semi2Lot",
      },
      {
        Header: "목표일",
        accessor: "halbDate",
      },
      {
        Header: "비고",
        accessor: "memo",
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, setGlobalFilter } =
    useTable({ columns, data: dgSEPTD }, useFilters, useGlobalFilter );

  const handleSearchChange = (e) => {
    const value = e.target.value || "";
    setSearchValue(value);
    setGlobalFilter(value || undefined); // undefined로 설정하여 전체 행을 표시하도록 설정
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value); // Update input field value
  };

  const handleCellClick = (cellData, planNo, columnName) => {
    setInputValue(cellData);
    setSelectedColumnName(columnName);
    setSelectedPlanNo(planNo);
    setIsModalOpen(true);
};

const handleSave = async () => {
    try {
        const response = await axios.post("/api/saveData", {
            planNo: selectedPlanNo,
            columnName: selectedColumnName, // 선택한 열의 실제 컬럼 이름을 전달
            cellValue: inputValue
        });
        console.log(response.data);
        setIsModalOpen(false);
        fetchData();
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

const AddDataRow = () => {
  const [planNo, setPlanNo] = useState('');
  const [MatCmf1, setMatCmf1] = useState('');
  const [mstMatCmf2, setMstMatCmf2] = useState('');
  const [Qty, setQty] = useState('');
  const [비고, set비고] = useState('');  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      planNo,
      MatCmf1,
      mstMatCmf2,
      Qty,
      비고
    };

    try {
      const response = await fetch('/api/Query_dgMasterTableAddRow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Response:', responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.addRow}>
        <label className={styles.addRowLabel} htmlFor="planNo">생산지시번호:</label>
        <input
          className={styles.addRowInput}
          type="text"
          id="planNo"
          value={planNo}
          onChange={(e) => setPlanNo(e.target.value)}
        />
        <label htmlFor="MatCmf1">cat.no:</label>
        <input
          className={styles.addRowInput}
          type="text"
          id="MatCmf1"
          value={MatCmf1}
          onChange={(e) => setMatCmf1(e.target.value)}
        />
        <label htmlFor="mstMatCmf2">구성품:</label>
        <input
          className={styles.addRowInput}
          type="text"
          id="mstMatCmf2"
          value={mstMatCmf2}
          onChange={(e) => setMstMatCmf2(e.target.value)}
        />
        <label htmlFor="Qty">수량:</label>
        <input
          className={styles.addRowInput}
          type="text"
          id="Qty"
          value={Qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <label htmlFor="비고">비고:</label>
        <input
          className={styles.addRowInput}
          type="text"
          id="비고"
          value={비고}
          onChange={(e) => set비고(e.target.value)}
        />        
        <button type="submit">행추가</button>
      </div>
    </form>
  );
};

  return (
    <div className="App">
      <div className={styles.page}>
        <input
          className={styles.input}
          type="text"
          placeholder="검색"
          value={searchValue}
          onChange={handleSearchChange}
        />
        <div><AddDataRow /></div>
          <div className={styles.page__body}>

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
              </table>


            <div className={styles.container}>

              <table className={styles.table2} {...getTableProps()}>
                <tbody {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td
                            key={cell.column.id}
                            onClick={() => handleCellClick(cell.value, row.original.planNo, cell.column.id)}
                            className={styles.cell}
                            style={{
                              backgroundColor: (() => {
                                switch (cell.column.id) {
                                  case 'planNo':
                                    return "white"
                                  case 'MatCmf1':
                                    return "white"
                                  case 'mstMatCmf2':
                                    return "white"
                                  case 'Qty':
                                    return "white"
                                  case 'ElutionLot':
                                    return !row.original.Elution ? "white" : "white"
                                  case 'EpochLot':
                                    return !row.original.Epoch ? "white" : "white"
                                  case 'PmMonoLot':
                                    return row.original.operCode && row.original.operCode.includes("OPR-041") &&
                                      (row.original.PmMonoLotQCR && row.original.PmMonoLotQCR.includes("OK")) ? "white" :
                                      row.original.operCode && row.original.operCode.includes("OPR-041") &&
                                      (row.original.PmMonoLotQCR && !row.original.PmMonoLotQCR.includes("OK") && row.original.PmMonoLotQCR.includes("NG")) ? "red" :
                                      (row.original.operCode && row.original.operCode.includes("OPR-041") && !row.original.PmMonoLotQCR &&
                                      !row.original.PmMono) ? "white" : 
                                      row.original.operCode && row.original.operCode.includes("OPR-041") &&
                                      !row.original.PmMonoLotQCR && row.original.PmMonoLot ? "yellow" :
                                      (row.original.operCode && !row.original.operCode.includes("OPR-041")) ? "gray" : "black";
                                  case 'TomMonoLot':
                                    return row.original.operCode && row.original.operCode.includes("OPR-042") &&
                                      (row.original.TomMonoLotQCR && row.original.TomMonoLotQCR.includes("OK")) ? "white" :
                                      row.original.operCode && row.original.operCode.includes("OPR-042") &&
                                      (row.original.TomMonoLotQCR && !row.original.TomMonoLotQCR.includes("OK") && row.original.TomMonoLotQCR.includes("NG")) ? "red" :
                                      (row.original.operCode && row.original.operCode.includes("OPR-042") && !row.original.TomMonoLotQCR &&
                                      !row.original.TomMono) ? "white" : 
                                      row.original.operCode && row.original.operCode.includes("OPR-042") &&
                                      !row.original.TomMonoLotQCR && row.original.TomMonoLot ? "yellow" :
                                      (row.original.operCode && !row.original.operCode.includes("OPR-042")) ? "gray" : "black";
                                  case 'OmMonoLot':
                                    return row.original.operCode && row.original.operCode.includes("OPR-040") &&
                                      (row.original.OmMonoLotQCR && row.original.OmMonoLotQCR.includes("OK")) ? "white" :
                                      row.original.operCode && row.original.operCode.includes("OPR-040") &&
                                      (row.original.OmMonoLotQCR && !row.original.OmMonoLotQCR.includes("OK") && row.original.OmMonoLotQCR.includes("NG")) ? "red" :
                                      (row.original.operCode && row.original.operCode.includes("OPR-040") && !row.original.OmMonoLotQCR &&
                                      !row.original.OmMono) ? "white" : 
                                      row.original.operCode && row.original.operCode.includes("OPR-040") &&
                                      !row.original.OmMonoLotQCR && row.original.OmMonoLot ? "yellow" :
                                      (row.original.operCode && !row.original.operCode.includes("OPR-040")) ? "gray" : "black";
                                  case 'Minisemi1Lot':
                                    return row.original.operCode && row.original.operCode.includes("OPR-050") &&
                                      (row.original.Minisemi1LotQCR && row.original.Minisemi1LotQCR.includes("OK")) ? "white" :
                                      row.original.operCode && row.original.operCode.includes("OPR-050") &&
                                      (row.original.Minisemi1LotQCR && !row.original.Minisemi1LotQCR.includes("OK") && row.original.Minisemi1LotQCR.includes("NG")) ? "red" :
                                      (row.original.operCode && row.original.operCode.includes("OPR-050") && !row.original.Minisemi1LotQCR &&
                                      !row.original.Minisemi1) ? "white" : 
                                      row.original.operCode && row.original.operCode.includes("OPR-050") &&
                                      !row.original.Minisemi1LotQCR && row.original.Minisemi1Lot ? "yellow" :
                                      (row.original.operCode && !row.original.operCode.includes("OPR-050")) ? "gray" : "black";
                                  case 'Semi1Lot':
                                    return row.original.operCode && row.original.operCode.includes("OPR-060") &&
                                      (row.original.Semi1LotQCR && row.original.Semi1LotQCR.includes("OK")) ? "white" :
                                      row.original.operCode && row.original.operCode.includes("OPR-060") &&
                                      (row.original.Semi1LotQCR && !row.original.Semi1LotQCR.includes("OK") && row.original.Semi1LotQCR.includes("NG")) ? "red" :
                                      (row.original.operCode && row.original.operCode.includes("OPR-060") && !row.original.Semi1LotQCR &&
                                      !row.original.Semi1) ? "white" : 
                                      row.original.operCode && row.original.operCode.includes("OPR-060") &&
                                      !row.original.Semi1LotQCR && row.original.Semi1Lot ? "yellow" :
                                      (row.original.operCode && !row.original.operCode.includes("OPR-060")) ? "gray" : "black";
                                  case 'Semi2Lot':
                                    return row.original.Semi2LotQCR && row.original.Semi2LotQCR.includes("OK") ? "white" :
                                      row.original.Semi2LotQCR && !row.original.Semi2LotQCR.includes("OK") && row.original.Semi2LotQCR.includes("NG") ? "red" :
                                      !row.original.Semi2LotQCR && !row.original.Semi2 ? "white" : 
                                      !row.original.Semi2LotQCR && row.original.Semi2Lot ? "yellow" : "black";
                                  case 'halbDate':
                                    return "white"
                                  case 'memo':
                                    return "white"
                                  default:
                                    return "white";
                                }
                              })()
                            }}
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
        </div>  
      </div>
            {isModalOpen && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>
                  <span className={styles.closeModal} onClick={() => setIsModalOpen(false)}>
                    &times;
                  </span>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                  <button onClick={handleSave}>Save</button>
                </div>
              </div>
            )}
    </div>
  );
}
