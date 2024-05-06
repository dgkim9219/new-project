"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState,useRef } from 'react'
import axios from 'axios';
import styles from "../styles/calendarOligo.module.css";


export default function CalendarPage() {
  const [fixedPlanOligo, setFixedPlanOligo] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      let response_fixedPlanOligo = await axios.get('/api/Query_fixedPlanOligo');
      setFixedPlanOligo(response_fixedPlanOligo.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const [calendarHeight, setCalendarHeight] = useState('90vh');

  // useEffect(() => {
  //   const handleResize = () => {
  //     setCalendarHeight(`${window.innerHeight * 0.9}px`);
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);



  return (
    <div>
      <div className="font-extrabold"></div>
      <FullCalendar
        className={styles.fc}
        initialView="dayGridDay"
        plugins={[dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev next today',
          center: 'title',
          right: 'dayGridMonth dayGridDay'
        }}
        events={fixedPlanOligo.map(event => ({
          id: event.id, 
          title: event.title, 
          start: event.start, 
          end: event.end 
        }))}
        nowIndicator={true}
        editable={true}
        selectable={true}
        selectMirror={true}
        displayEventTime={false}
        locales="ko"
        html={true}
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
          hour12: false
        }}
        height="90vh"

      />
    </div>
  );
}
