import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

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
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${!day ? 'empty' : ''} ${isPastDay(day) ? 'past-day' : ''}`}
              onClick={() => handleDayClick(day)}
              style={isPastDay(day) ? { pointerEvents: 'none', color: 'gray' } : {}}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

 
      <div id="summary" className="summary">
        <SummaryPage />
      </div>
    </div>
  );
};

export default CustomCalendar;
