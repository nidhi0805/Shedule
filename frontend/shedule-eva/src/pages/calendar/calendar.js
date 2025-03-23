import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './calendar.css';
import SummaryPage from '../summary'; 

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); 
  const [tasksCompleted, setTasksCompleted] = useState(5);  
  const [totalTasks, setTotalTasks] = useState(10);  
  const [activityDates, setActivityDates] = useState([]); 
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail');
    if (storedEmail) {
      axios.get(`${process.env.REACT_APP_API_URL}/get-all-activities/${storedEmail}`)
        .then(response => {
          if (response.data && response.data.length) {
           
            const dates = response.data
              .filter(item => item.activities.some(activity => activity !== null))
              .map(item => {
                const dateObj = new Date(item.date);
                const year = dateObj.getFullYear();
                const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
                const day = dateObj.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
              });
            setActivityDates(dates);
          }
        })
        .catch(err => {
          console.error('Error fetching activities:', err);
        });
    }
  }, []);


  const generateCalendar = () => {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();
    const days = [];

    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isPastDay = (day) => {
    if (!day) return false;
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dayDate < today;
  };

  const isToday = (day) => {
    if (!day) return false;
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dayDate.getTime() === today.getTime();
  };

  const handleDayClick = (day) => {
    if (isPastDay(day)) return;

    const selectedYear = currentDate.getFullYear();
    const selectedMonth = currentDate.getMonth() + 1; 
    const selectedDay = day;

    setSelectedDate({ year: selectedYear, month: selectedMonth, day: selectedDay });
    navigate(`/schedule/${selectedYear}/${selectedMonth}/${selectedDay}`);
  };

  const days = generateCalendar();
  const progress = (tasksCompleted / totalTasks) * 100;

  return (
    <div id="calendar-container" className="calendar-layout">
      <div id="calendar" className="calendar">
        <div className="calendar-header">
          <button onClick={goToPreviousMonth}>&lt;</button>
          <span>{months[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
          <button onClick={goToNextMonth}>&gt;</button>
        </div>
        <div className="calendar-grid">
          {daysOfWeek.map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            let hasActivity = false;
            let dayStr = "";
            if (day) {
              const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              dayStr = `${dayDate.getFullYear()}-${(dayDate.getMonth() + 1)
                .toString()
                .padStart(2, '0')}-${dayDate.getDate().toString().padStart(2, '0')}`;
              hasActivity = activityDates.includes(dayStr);
            }
            return (
              <div
                key={index}
                className={`calendar-day 
                ${!day ? 'empty' : ''} 
                ${isPastDay(day) ? 'past-day' : ''} 
                ${isToday(day) ? 'today' : ''}`}
                onClick={() => handleDayClick(day)}
                style={isPastDay(day) ? { pointerEvents: 'none', color: 'gray' } : {}}
              >
                {day}
                {day && hasActivity && <span className="activity-dot" title="Activity exists on this day"></span>}
              </div>
            );
          })}
        </div>
      </div>

      <div id="summary" className="summary">
        <SummaryPage />
      </div>
    </div>
  );
};

export default CustomCalendar;
