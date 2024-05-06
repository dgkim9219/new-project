"use client";

import styles from "../styles/table.module.scss";
import * as React from "react";
import { useTable, useFilters, useGlobalFilter } from "react-table";
import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import RefreshTable from "../components/RefreshTable";



export default function Table(): JSX.Element {
  const [dgSEPTD, setDgSEPTD] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumnName, setSelectedColumnName] = useState(null); // To store data of selected cell
  const [selectedPlanNo, setSelectedPlanNo] = useState(null); // To store selected planNo
  const [isModalOpen, setIsModalOpen] = useState(false); // To control modal open/close state
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputValue2, setInputValue2] = useState(''); // To store input field value
  const [isUrgent, setIsUrgent] = useState(false);
  const [isHold, setIsHold] = useState(false);
  const [isNoMat, setIsNoMat] = useState(false);
  
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(()=>{
    handleSave();
  },[startDate])

  const fetchData = async () => {
    try {
      const response2 = await axios.get("/api/Query_dgSuperEndPointTableOligo");
      const modifiedData = response2.data.map((item) => {
        
        const splitData = item.Qty ? item.Qty.split(',') : [];
        const formattedQty = splitData.map(qty => {
          const parsedQty = parseInt(qty, 10);
          return parsedQty.toLocaleString();
        });

        // ','를 기준으로 데이터를 분리합니다.
        const splitData1 = item.ElutionLot ? item.ElutionLot.split(',') : [];
  
        // 각각의 데이터에 대해 '-' 다음에 있는 6자리 숫자를 추출하여 'E'를 붙여서 반환합니다.
        const formattedElutionLots = splitData1.map((elutionLot) => {
          const match = /-(\d{6})/.exec(elutionLot);
          if (match) {
            const sixDigitNumber = match[1]; // '-' 다음에 있는 6자리 숫자를 추출합니다.
            return `${sixDigitNumber}E`;
          }
          return elutionLot; // 패턴에 일치하는 숫자가 없는 경우 기존 데이터를 반환합니다.
        });
        const splitData2 = item.EpochLot ? item.EpochLot.split(',') : [];
        const formattedEpochLots = splitData2.map((epochLot) => {
          const match = /-(\d{6})/.exec(epochLot);
          if (match) {
            const sixDigitNumber = match[1];
            return `${sixDigitNumber}농`;
          }
          return epochLot;
        });
        const splitData3 = item.PmMonoLot ? item.PmMonoLot.split(',') : [];
        const formattedPmMonoLots = splitData3.map((PmMonoLot) => {
          const match = /-(\d{6})/.exec(PmMonoLot);
          if (match) {
            const sixDigitNumber = match[1];
            return `${sixDigitNumber}M`;
          }
          return PmMonoLot;
        });
        const splitData4 = item.TomMonoLot ? item.TomMonoLot.split(',') : [];
        const formattedTomMonoLots = splitData4.map((TomMonoLot) => {
          const match = /-(\d{6})/.exec(TomMonoLot);
          if (match) {
            const sixDigitNumber = match[1];
            return `${sixDigitNumber}M`;
          }
          return TomMonoLot;
        });  
        const splitData5 = item.OmMonoLot ? item.OmMonoLot.split(',') : [];
        const formattedOmMonoLots = splitData5.map((OmMonoLot) => {
          const match = /-(\d{6})/.exec(OmMonoLot);
          if (match) {
            const sixDigitNumber = match[1];
            return `${sixDigitNumber}M`;
          }
          return OmMonoLot;
        });  
        const splitData6 = item.Minisemi1Lot ? item.Minisemi1Lot.split(',') : [];
        const formattedMinisemi1Lots = splitData6.map((Minisemi1Lot) => {
          const match = /-(\d{6})/.exec(Minisemi1Lot);
          if (match) {
            const sixDigitNumber = match[1];
            return `${sixDigitNumber}T`;
          }
          return Minisemi1Lot;
        });  
        const splitData7 = item.Semi1Lot ? item.Semi1Lot.split(',') : [];
        const formattedSemi1Lots = splitData7.map((Semi1Lot) => {
          const match = /-(\d{6})/.exec(Semi1Lot); // "-" 뒤에 6자리 숫자가 있는지 확인합니다.
          if (match) {
            const numberAfterHyphen = match[1];
            // 문자열이 "R-"로 시작하는지 확인합니다.
            if (Semi1Lot.startsWith("R-")) {
              // "R-"로 시작하는 경우, 두 번째 "-" 이후의 문자열을 반환합니다.
              const secondHyphenIndex = Semi1Lot.indexOf("-", Semi1Lot.indexOf("-") + 1);
              return secondHyphenIndex !== -1 ? Semi1Lot.substring(secondHyphenIndex + 1) : '';
            } else {
              // 그렇지 않은 경우, 첫 번째 "-" 이후의 문자열을 반환합니다.
              const firstHyphenIndex = Semi1Lot.indexOf("-");
              return firstHyphenIndex !== -1 ? Semi1Lot.substring(firstHyphenIndex + 1) : '';
            }
          }
          // 일치하는 부분이 없는 경우, 원래의 문자열을 반환합니다.
          return Semi1Lot;
        });
        // const splitData8 = item.Semi2Lot ? item.Semi2Lot.split(',') : [];
        // const formattedSemi2Lots = splitData8.map((Semi2Lot) => {
        //   const match = /-(\d{6})/.exec(Semi2Lot);
        //   if (match) {
        //     const sixDigitNumber = match[1];
        //     return `${sixDigitNumber}S`;
        //   }
        //   return Semi2Lot;
        // });  

        return {
          ...item,
          MatCmf1: item.MatCmf1 ? item.MatCmf1.replace(/,/g, '\n') : item.MatCmf1,
          mstMatCmf2: item.mstMatCmf2 ? item.mstMatCmf2.replace(/,/g, '\n') : item.mstMatCmf2,
          Qty: formattedQty.join('\n'),
          ElutionLot: formattedElutionLots.join('\n'),
          EpochLot: formattedEpochLots.join('\n'),
          PmMonoLot: formattedPmMonoLots.join('\n'),
          TomMonoLot: formattedTomMonoLots.join('\n'),
          OmMonoLot: formattedOmMonoLots.join('\n'),
          Minisemi1Lot: formattedMinisemi1Lots.join('\n'),
          Semi1Lot: formattedSemi1Lots.join('\n'),
          Semi2Lot: item.Semi2Lot ? item.Semi2Lot.replace(/,/g, '\n') : item.Semi2Lot,
          halbDate: item.halbDate ? item.halbDate.replace(/,/g, '\n') : item.halbDate
      }
    });
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
        Header: "소량반제품1",
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


  const handleInputChange2 = (e) => {
    setInputValue2(e.target.value);
  };

  const handleCellClick = (cellData, planNo, columnName) => {
    setInputValue2(cellData);
    setSelectedColumnName(columnName);
    setSelectedPlanNo(planNo);
    setIsModalOpen(true);
    setShowDatePicker(true);
  };

 

const handleSave = async () => {
  const year = startDate.getFullYear();
  const month = ('0' + (startDate.getMonth() + 1)).slice(-2); // 1의 자리 숫자면 앞에 0을 붙입니다.
  const day = ('0' + startDate.getDate()).slice(-2);
    try {

        const response15 = await axios.post("/api/saveData", {
            planNo: selectedPlanNo,
            columnName: selectedColumnName, // 선택한 열의 실제 컬럼 이름을 전달
            cellValue: `${year}-${month}-${day}`
        });
        
        setIsModalOpen(false);

        await fetchData();
    } catch (error) {
        console.error("Error saving data:", error);
    }
};

const handleSave2 = async () => {
  try {
      const response15 = await axios.post("/api/saveData", {
          planNo: selectedPlanNo,
          columnName: selectedColumnName, // 선택한 열의 실제 컬럼 이름을 전달
          cellValue: inputValue2
      });
      setIsModalOpen(false);

      fetchData();
  } catch (error) {
      console.error("Error saving data:", error);
  }
};

const handleSave3 = async () => {
  try {
    if (isUrgent) {
      await axios.post("/api/saveData", {
        planNo: selectedPlanNo,
        columnName: 'emer',
        cellValue: "긴급"
    });
    fetchData();
    }
    else {
      await axios.post("/api/saveData", {
        planNo: selectedPlanNo,
        columnName: 'emer',
        cellValue: ""
    });
    fetchData();
    }

  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const handleSave4 = async () => {
  try {
    if (isHold) {
      await axios.post("/api/saveData", {
        planNo: selectedPlanNo,
        columnName: 'hold',
        cellValue: "hold"
    });
    fetchData();
    }
    else {
      await axios.post("/api/saveData", {
        planNo: selectedPlanNo,
        columnName: 'hold',
        cellValue: ""
    });
    fetchData();
    }

  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const handleSave5 = async () => {
  try {
    if (isNoMat) {
      await axios.post("/api/saveData", {
        planNo: selectedPlanNo,
        columnName: 'noMat',
        cellValue: "noMat"
    });
    fetchData();
    }
    else {
      await axios.post("/api/saveData", {
        planNo: selectedPlanNo,
        columnName: 'noMat',
        cellValue: ""
    });
    fetchData();
    }

  } catch (error) {
    console.error("Error saving data:", error);
  }
};

const handleUrgentCheckboxChange = (event) => {
  setIsUrgent(event.target.checked);
};

const handleUrgentCheckboxChange2 = (event) => {
  setIsHold(event.target.checked);
};

const handleUrgentCheckboxChange3 = (event) => {
  setIsNoMat(event.target.checked);
};

const AddDataRow = () => {
  const [planNo, setPlanNo] = useState('');
  const [MatCmf1, setMatCmf1] = useState('');
  const [mstMatCmf2, setMstMatCmf2] = useState('');
  const [Qty, setQty] = useState('');
  const [memo, setmemo] = useState('');  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      planNo,
      MatCmf1,
      mstMatCmf2,
      Qty,
      memo
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
      fetchData();
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
        <label htmlFor="memo">비고:</label>
        <input
          className={styles.addRowInput}
          type="text"
          id="memo"
          value={memo}
          onChange={(e) => setmemo(e.target.value)}
        />        
        <button type="submit">행추가</button>
      </div>
    </form>
  );
};

  return (
    <div className="App">
      <div className={styles.page}>
        <div className={styles.searchBox}>
          <input
            className={styles.input}
            type="text"
            placeholder="검색"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <div className={styles.iconWrapper}>
            <img src="/searchIcon.png" alt="검색" className={styles.searchIcon} />
          </div>
          <img src="/emer100.png" className={styles.comentIcon} />
          <label className={styles.coment}>긴급생산</label>
          <img src="/noMat100.png" className={styles.comentIcon} />
          <label className={styles.coment}>원재료 없음</label>
          <img src="/hold100.png" className={styles.comentIcon} />
          <label className={styles.coment}>홀딩</label>
          <img src="/ABDEE6.png" className={styles.comentIcon} />
          <label className={styles.coment}>생산예정</label>
          <img src="/FFFFB5.png" className={styles.comentIcon} />
          <label className={styles.coment}>QC대기중</label>
          <img src="/97C1A9.png" className={styles.comentIcon} />
          <label className={styles.coment}>QC통과</label>
          <img src="/FF968A.png" className={styles.comentIcon} />
          <label className={styles.coment}>부적합</label>
        </div>
        <div className={styles.addRow}><AddDataRow /></div>
        <div><RefreshTable /></div>
          <div className={styles.page__body}>
              <table className={styles.table1} {...getTableProps()}>
                <thead className={styles.thead}>
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th className={styles.headerCell} {...column.getHeaderProps()}>{column.render("Header")}</th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className={styles.tbody} {...getTableBodyProps()}>
                  {rows.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                          <td
                            key={cell.column.id}
                            onClick={() => {handleCellClick(cell.value, row.original.planNo, cell.column.id);
                               }}
                            className={styles.cell}
                            style={{
                              backgroundImage: (() => {
                                // if (cell.column.id === 'planNo' && row.original.emer && row.original.emer.includes("긴급")) {
                                //   return `url('/emer.png')`;
                                // } else {
                                //   return "none";
                                // }
                                switch (cell.column.id) {
                                  case 'planNo':
                                    return row.original.emer && row.original.emer.includes("긴급") ? `url('/emer30.png')` : `url('/null.png')`
                                  case 'MatCmf1':
                                    return row.original.noMat && row.original.noMat.includes("noMat") ? `url('/noMat50.png')` : `url('/null.png')`
                                  case 'mstMatCmf2':
                                    return row.original.hold && row.original.hold.includes("hold") ? `url('/hold50.png')` : `url('/null.png')`
                                  default:
                                    return null;
                                }

                              })(),
                              
                              backgroundColor: (() => {
                                switch (cell.column.id) {
                                  case 'ElutionLot':
                                    return row.original.mstMatCmf2.includes("DNA") ? "gray" : 
                                      row.original.ElutionLot && row.original.ElutionLot.includes("-") ? "#ABDEE6" : "white"
                                  case 'EpochLot':
                                    return row.original.mstMatCmf2.includes("DNA") ? "gray" : 
                                    row.original.EpochLot && row.original.EpochLot.includes("-") ? "#ABDEE6" : "white"
                                  case 'PmMonoLot':
                                    return row.original.PmMonoLotQCR && row.original.PmMonoLotQCR.includes("OK") && !row.original.TomMonoLotQCR  && !row.original.OmMonoLotQCR  && !row.original.Minisemi1LotQCR  && !row.original.Semi1LotQCR  && !row.original.Semi2LotQCR   ? "#97C1A9" :
                                      row.original.PmMonoLotQCR && !row.original.PmMonoLotQCR.includes("OK") && row.original.PmMonoLotQCR.includes("NG") ? "#FF968A" :
                                      !row.original.PmMonoLotQCR && row.original.PmMonoLot && !row.original.PmMonoLot.includes("-") && row.original.PmMonoLot.includes("M") ? "#FFFFB5" :
                                      row.original.PmMonoLot && row.original.PmMonoLot.includes("-") ? "#ABDEE6" :
                                      row.original.operCode && row.original.operCode.includes("OPR-041") ? "white" : "gray";
                                  case 'TomMonoLot':
                                    return row.original.TomMonoLotQCR && row.original.TomMonoLotQCR.includes("OK") && !row.original.OmMonoLotQCR  && !row.original.Minisemi1LotQCR  && !row.original.Semi1LotQCR  && !row.original.Semi2LotQCR   ? "#97C1A9" :
                                      row.original.TomMonoLotQCR && !row.original.TomMonoLotQCR.includes("OK") && row.original.TomMonoLotQCR.includes("NG") ? "#FF968A" :
                                      !row.original.TomMonoLotQCR && row.original.TomMonoLot && !row.original.TomMonoLot.includes("-") && row.original.TomMonoLot.includes("M") ? "#FFFFB5" :
                                      row.original.TomMonoLot && row.original.TomMonoLot.includes("-") ? "#ABDEE6" :
                                      row.original.operCode && row.original.operCode.includes("OPR-042") ? "white" : "gray";
                                  case 'OmMonoLot':
                                    return row.original.OmMonoLotQCR && row.original.OmMonoLotQCR.includes("OK") && !row.original.Minisemi1LotQCR  && !row.original.Semi1LotQCR  && !row.original.Semi2LotQCR   ? "#97C1A9" :
                                      row.original.OmMonoLotQCR && !row.original.OmMonoLotQCR.includes("OK") && row.original.OmMonoLotQCR.includes("NG") ? "#FF968A" :
                                      !row.original.OmMonoLotQCR && row.original.OmMonoLot && !row.original.OmMonoLot.includes("-") && row.original.OmMonoLot.includes("M") ? "#FFFFB5" :
                                      row.original.OmMonoLot && row.original.OmMonoLot.includes("-") ? "#ABDEE6" :
                                      row.original.operCode && row.original.operCode.includes("OPR-040") ? "white" : "gray";
                                  case 'Minisemi1Lot':
                                    return row.original.Minisemi1LotQCR && row.original.Minisemi1LotQCR.includes("OK") && !row.original.Semi1LotQCR  && !row.original.Semi2LotQCR   ? "#97C1A9" :
                                      row.original.Minisemi1LotQCR && !row.original.Minisemi1LotQCR.includes("OK") && row.original.Minisemi1LotQCR.includes("NG") ? "#FF968A" :
                                      !row.original.Minisemi1LotQCR && row.original.Minisemi1Lot && !row.original.Minisemi1Lot.includes("-") && row.original.Minisemi1Lot.includes("T") ? "#FFFFB5" :
                                      row.original.Minisemi1Lot && row.original.Minisemi1Lot.includes("-") ? "#ABDEE6" :
                                      row.original.operCode && row.original.operCode.includes("OPR-050") ? "white" : "gray";
                                  case 'Semi1Lot':
                                    return row.original.Semi1LotQCR && row.original.Semi1LotQCR.includes("OK") && !row.original.Semi2LotQCR   ? "#97C1A9" :
                                      row.original.Semi1LotQCR && !row.original.Semi1LotQCR.includes("OK") && row.original.Semi1LotQCR.includes("NG") ? "#FF968A" :
                                      !row.original.Semi1LotQCR && row.original.Semi1Lot && !row.original.Semi1Lot.includes("-") && row.original.Semi1Lot.includes("R") ? "#FFFFB5" :
                                      row.original.Semi1Lot && row.original.Semi1Lot.includes("-") ? "#ABDEE6" :
                                      row.original.operCode && row.original.operCode.includes("OPR-060") ? "white" : "gray";
                                  case 'Semi2Lot':
                                    return row.original.Semi2LotQCR && row.original.Semi2LotQCR.includes("OK") ? "#97C1A9" :
                                      row.original.Semi2LotQCR && !row.original.Semi2LotQCR.includes("OK") && row.original.Semi2LotQCR.includes("NG") ? "#FF968A" :
                                      !row.original.Semi2LotQCR && row.original.Semi2Lot && !row.original.Semi2Lot.includes("-") ? "#FFFFB5" :
                                      row.original.Semi2Lot && row.original.Semi2Lot.includes("2024-") ? "#ABDEE6" :
                                      !row.original.Semi2LotQCR && row.original.Semi2Lot ? "#FFFFB5" : "white";
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
            {isModalOpen && (
              <div className={styles.modal}>
                <div className={styles.modalContent}>



                  <span className={styles.closeModal} onClick={() => setIsModalOpen(false)}>
                    &times;
                  </span>   



                      {showDatePicker && (
                        <DatePicker              
                          selected={startDate}
                          onChange={async (date) => {
                              setStartDate(date);
                          //  await handleSave();
                          }}
                          inline // 인라인 달력 표시
                          portalId="modalPortal" // 모달 내부에만 표시되도록 설정
                        />
                      )}


                      <input
                        className={styles.modalInput}
                        type="text"
                        value={inputValue2}
                        onChange={handleInputChange2}
                      />
                      <button onClick={handleSave2}>수기입력</button>

                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={isUrgent}
                            onChange={handleUrgentCheckboxChange}
                          />
                          긴급
                        </label>
                        <button onClick={handleSave3}>저장</button>
                      </div>

                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={isHold}
                            onChange={handleUrgentCheckboxChange2}
                          />
                          홀딩
                        </label>
                        <button onClick={handleSave4}>저장</button>
                      </div>

                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={isNoMat}
                            onChange={handleUrgentCheckboxChange3}
                          />
                          원재료 없음
                        </label>
                        <button onClick={handleSave5}>저장</button>
                      </div>

                </div>
              </div>
            )}



    </div>
  );
}
