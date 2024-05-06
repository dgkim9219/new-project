/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import axios from 'axios';

const Qcing = ({data}) => {
  // console.log(data);
  const [unStart, setUnstart] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let response_unStart = await axios.get('/api/Query_qcIng');
      if (data ==='fert'){
        const filteredData = response_unStart.data.filter(item => item["inspType"] === "OQC");
        setUnstart(filteredData);
      }else{
        const filteredData = response_unStart.data.filter(item => item["inspType"] === "PQC");
        setUnstart(filteredData);
      }
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columnDefs = [
    { 
      headerName: '지시번호', 
      field: 'ordCmf2' , width: 110, 
      cellStyle: { textAlign: 'center', padding: '1px',  fontSize: '12px'},
      headerStyle: { fontSize: '13px', textAlign: 'center' }, 
    },
    { 
      headerName: '검사요청', 
      field: 'inspReqDate' , width: 110, 
      cellStyle: { padding: '1px',  fontSize: '12px'},
      headerStyle: { fontSize: '13px', textAlign: 'center' }, 
    },
    { 
      headerName: 'Lot', 
      field: 'reqCmf2' , width: 250, 
      cellStyle: { padding: '1px',  fontSize: '12px'},
      headerStyle: { fontSize: '13px', textAlign: 'center' }, 
    },
    { 
      headerName: 'cat.no', 
      field: 'reqCmf3' , width: 110, 
      cellStyle: { textAlign: 'left', padding: '1px',  fontSize: '12px'},
      headerStyle: { fontSize: '13px', textAlign: 'center' }, 
    },
    { 
      headerName: '생산수량', 
      field: 'prodQty' , width: 110, 
      cellStyle: { textAlign: 'right', padding: '1px',  fontSize: '12px'},
      headerStyle: { fontSize: '13px', textAlign: 'center' }, 
    }
  ];

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
  };
  const onGridReady = (params) => {
    params.api.sizeColumnsToFit();
  };

  const [gridHeight, setGridHeight] = useState('90vh');

  useEffect(() => {
    const handleResize = () => {
      setGridHeight(`${window.innerHeight * 0.9}px`);
    };

    // 처음 컴포넌트가 마운트될 때 이벤트 리스너를 추가하고,
    // 컴포넌트가 언마운트될 때 이를 제거합니다.
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행되도록 합니다.


  return (
    <div>
      <div className="font-extrabold">검사중: {unStart.length} LOT</div>
      <div className="w-full">
        <div className="ag-theme-alpine"style={{ height: gridHeight, width: 'auto', margin: '0 auto' ,overflow: 'auto' }}>
          <AgGridReact
            columnDefs={columnDefs}
            autoSizeColumns={true}
            rowData={unStart}
            defaultColDef={defaultColDef}
            domLayout='autoHeight'
            onGridReady={onGridReady}
            enableRangeSelection ={true}
            gridOptions={
              {floatingFilter: true, domLayout: 'autoHeight'}}
          />
          
        </div>
      </div>
    </div>
  );
};

export default Qcing;
