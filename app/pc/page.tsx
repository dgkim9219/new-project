"use client";

import Table from "../../components/TablePC";
import React from 'react';
import Calendar from '../../components/calendarPC';
import styles from "../../styles/oligo.module.css";

export default function Pc(){
  return (
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Calendar />
        </div>
        <div className={styles.rightSection}>
          <Table />
        </div>
      </div>
  );
}