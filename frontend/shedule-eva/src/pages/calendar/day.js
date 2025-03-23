import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import TaskModal from './taskModal';
import './day.css';
import { useUser } from '../../userContext';

const Day = () => {
  const navigate = useNavigate();
  const { year, month, day } = useParams();
  const user = useUser();
  const [newTask, setNewTask] = useState({ name: '', type: 'Work' });
  const [showForm, setShowForm] = useState({ open: false, time: '' });
  const [tasks, setTasks] = useState({});
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;


  useEffect(() => {
    const fetchUserActivities = async () => {
      if (!user?.user?.email) return; 
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/get-user-activity/${user.user.email}/${formattedDate}`);
        if (response.ok) {
          const data = await response.json();
          const activityData = data.activities || []; 
          
         
          const taskObj = activityData.reduce((acc, activity, index) => {
            if (activity) {
              const hour = `${index}:00`;
              acc[hour] = { name: activity, type: 'Work' }; 
            }
            return acc;
          }, {});

          setTasks((prevTasks) => ({
            ...prevTasks,
            [formattedDate]: taskObj,
          }));
        } else {
          console.error('Failed to fetch activities');
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchUserActivities();
  }, [user, formattedDate]);

  const handleAddTask = (time) => {
    setShowForm({ open: true, time });
  };

  const handleSubmit = () => {
    if (!newTask.name.trim()) return;

    setTasks((prevTasks) => ({
      ...prevTasks,
      [formattedDate]: {
        ...(prevTasks[formattedDate] || {}),
        [showForm.time]: { name: newTask.name, type: newTask.type },
      },
    }));

    setShowForm({ open: false, time: '' });
    setNewTask({ name: '', type: 'Work' });
  };

  const handleClose = () => {
    setNewTask({ name: '', type: 'Work' });
    setShowForm({ open: false, time: '' });
  };

  const handleDoneClick = async () => {
    if (Object.keys(tasks).length === 0) return;

    const activities = Array(24).fill(null);

    Object.entries(tasks[formattedDate] || {}).forEach(([time, activity]) => {
      const hour = parseInt(time.split(':')[0], 10);
      activities[hour] = activity.name;
    });

    const requestData = {
      email: user.user.email,
      date: formattedDate,
      activities,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/add-user-activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        console.log('Activity data saved successfully');
        navigate(`/Categories/${year}/${month}/${day}`);
      } else {
        console.error('Failed to save activity data');
      }
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  return (
    <div className="schedule">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h2 style={{ marginBottom: 20 }}>Schedule for {formattedDate}</h2>
        <Button variant="outlined" color="success" onClick={handleDoneClick} disabled={Object.keys(tasks).length === 0}>
          Done
        </Button>
      </div>

      <div className="time-grid">
        {timeSlots.map((time) => (
          <div key={time} className="time-card" onClick={() => handleAddTask(time)}>
            <div className="time-label">{time}</div>
            {tasks[formattedDate]?.[time] ? (
              <div className={`task ${tasks[formattedDate][time].type.toLowerCase()}`}>
                {tasks[formattedDate][time].name}
              </div>
            ) : (
              <div className="task-placeholder">No task</div>
            )}
          </div>
        ))}
      </div>

      <TaskModal
        open={showForm.open}
        time={showForm.time}
        newTask={newTask}
        setNewTask={setNewTask}
        handleSubmit={handleSubmit}
        handleClose={handleClose}
      />
    </div>
  );
};

export default Day;
