"use client"

import { useEffect, useState,useRef } from 'react'
import AllOrder from "../../components/AllOrder"
import YearMonthRangePicker from "../../components/AllOrderYearMonthRangePicker"
import AllOrderTable from "../../components/AllOrder";
import AllOrderComplete from "../../components/AllOrderComplete"
import styles from "../../styles/main.module.css";

export default function Main() {

  const [selectedYearMonth, setSelectedYearMonth] = useState(""); // 선택된 연월을 상태로 관리합니다.

  const handleDateChange = (yearMonth) => {
      setSelectedYearMonth(yearMonth); // 선택된 연월을 상태에 업데이트합니다.
  };

    return (
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <AllOrderTable content={selectedYearMonth} />
        </div>
        <div className={styles.middleSection}>
          <AllOrderComplete />
        </div>
        <div className={styles.rightSection}>
          <YearMonthRangePicker onDateChange={handleDateChange} />
        </div>
      </div>
    );
}
