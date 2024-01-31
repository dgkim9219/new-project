"use client";

import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import styles from "../styles/calendar.module.css";

export default class DemoApp extends React.Component {
  render() {
    return (
      <div className={styles['cal-container']}>
        <FullCalendar
          plugins={[ dayGridPlugin ]}
          initialView="dayGridMonth"
          expandRows={false}
          handleWindowResize={true}
        />
      </div>
    )
  }
}