"use client"

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useEffect, useState,useRef } from 'react'
import axios from 'axios';
import Modal from './planNoModal2'


export default function CalendarPage(part) {
  let isPart = false;
  if (part.data ==undefined){
    isPart = false;
  }else{
    isPart= true;
    
  }

  const [fixedPlan2, setFixedplan2] = useState([]);
  useEffect(()=>{
    fetchData();

  },[]);

  const fetchData = async ()=> {
    try {
        let response_fixedPlan2 = await axios.get('/api/Query_fixedPlan2');
        if (isPart==true){
          const filteredData = response_fixedPlan2.data.filter(item => item["part"].toLowerCase() === part.data.toLowerCase()|| item["part"].toLowerCase() === "empty");
          setFixedplan2(filteredData);
        }else{
        setFixedplan2(response_fixedPlan2.data);
        }


      } catch (error) {
        console.error("Error fetching data:", error);
      }
  }


  // const [calendarHeight, setCalendarHeight] = useState('90vh');

  // useEffect(() => {
  //   const handleResize = () => {
  //     setCalendarHeight(`${window.innerHeight * 0.9}px`);
  //   };

  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);


  const [modalContent, setModalContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleEventClick = async (info) => {
    console.log(info.event.id);
    setModalContent((info.event.id).substring(0,10));
    setIsModalOpen(true);
  }


  return (
      <div>
        <div class ="font-extrabold	"></div>
        <FullCalendar class="text-xs"
          plugins={[
            dayGridPlugin,
            interactionPlugin,
          ]}
          headerToolbar={{
            left: 'prev next today',
            center: 'title',
            right: 'dayGridMonth dayGridWeek dayGridDay'
          }}
          events={fixedPlan2}
          nowIndicator={true}
          editable={true}
          selectable={true}
          selectMirror={true}

          eventClick={handleEventClick}
          displayEventTime={false}
          locales ="ko"
          html = {true}          
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            meridiem: 'short',
            hour12: false,
          }}
          height="90vh"
        />
      {isModalOpen && (
        <Modal closeModal={closeModal} content={modalContent} />
      )}
      </div>

  )
}

