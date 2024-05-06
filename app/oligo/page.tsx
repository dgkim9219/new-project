"use client";

import Table from "../../components/TableOligo";
import React from 'react';
import Calendar from '../../components/calendarOligo';
import styles from "../../styles/oligo.module.css";

export default function Oligo(){
  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <Calendar />
        </div>
        <div className={styles.rightSection}>
          <Table />
        </div>
      </div>
      </>
  );
}