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
  const [tasksCompleted, setTasksCompleted] = useState(5);  
  const [totalTasks, setTotalTasks] = useState(10);  
  const [activityDates, setActivityDates] = useState([]); 
  const [periodDays, setPeriodDays] = useState([]); // Array to store period days
  const [nextPeriodDate, setNextPeriodDate] = useState(null); // Store the next period date
  const [selectedDate, setSelectedDate] = useState(null); // Add this line to fix the error

  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);  // Set the time to midnight to compare dates without time

  // Fetch next period date from the chatbot API
  // Assuming this is your existing code, let's fix and improve it.


  useEffect(() => {
    const fetchNextPeriodDate = async () => {
      try {
        // Get email from sessionStorage
        const email = sessionStorage.getItem('userEmail');
  
        // Get current date directly
        const currentDateStr = new Date().toISOString().split('T')[0];
        console.log("Current Date for API Request:", currentDateStr);
  
        // Call the API to get the user activities and period date
        const response = await fetch(`http://localhost:5002/api/get-user-activity/${email}/${currentDateStr}`);
        const data = await response.json();
  
        const nextPeriodDateStr = data.period_date;
        console.log("Next Period Date from API:", nextPeriodDateStr);
  
        // Ensure the period date is valid and parse it as a date
        const nextPeriodDateObj = new Date(nextPeriodDateStr);
  
        // Check if the period date is valid before proceeding
        if (nextPeriodDateObj.toString() !== 'Invalid Date') {
          setNextPeriodDate(nextPeriodDateObj);
  
          // Calculate the period days (assuming the period lasts 5 days)
          const periodDaysArray = [];
          for (let i = 0; i < 5; i++) {
            const periodDay = new Date(nextPeriodDateObj);
            periodDay.setDate(nextPeriodDateObj.getDate() + i);
  
            // Ensure the period day is after today before adding to the list
            if (periodDay >= today) {
              periodDaysArray.push(periodDay.getDate());
            }
          }
  
          setPeriodDays(periodDaysArray);
          console.log("Period Days:", periodDaysArray); // Debugging line
        } else {
          console.log("Invalid period date returned from the API.");
        }
      } catch (error) {
        console.error('Error fetching period date:', error);
      }
    };
  
    fetchNextPeriodDate();
  }, []);  // Empty dependency array means it only runs once when the component mounts
  

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
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${!day ? 'empty' : ''} ${isPastDay(day) ? 'past-day' : ''} 
                ${periodDays.includes(day) ? 'period-day' : ''}`}
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
