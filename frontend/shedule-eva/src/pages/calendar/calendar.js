import React, { useState } from 'react';
import './calendar.css';
import Day from './day';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const CustomCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

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

  const days = generateCalendar();


  const isPastDay = (day) => {
    if (!day) return false; 
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dayDate < today;
  };

  const handleDayClick = (day) => {
    if (isPastDay(day)) return; 
    setSelectedDay(day);
  };

  const handleBackToCalendar = () => {
    setSelectedDay(null);
  };

  if (selectedDay !== null) {
    return (
      <Day
        day={selectedDay}
        month={months[currentDate.getMonth()]}
        year={currentDate.getFullYear()}
        onBack={handleBackToCalendar}
      />
    );
  }

  return (
    <div id="calendar">
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
  );
};

export default CustomCalendar;
