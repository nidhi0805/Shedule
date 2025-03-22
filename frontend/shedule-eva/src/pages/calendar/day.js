import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TaskModal from './taskModal'; 
import './day.css';

const Day = ({ day, month, year, onBack }) => {
  const navigate = useNavigate();
  const [newTask, setNewTask] = useState({ name: '', type: 'Work' });
  const [showForm, setShowForm] = useState({ open: false, time: '' });
  const [tasks, setTasks] = useState({});
  const [showCategories, setShowCategories] = useState(false);

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const selectedDate = new Date(year, month, day);

  const handleAddTask = (time) => {
    setShowForm({ open: true, time });
  };

  const handleSubmit = () => {
    if (!newTask.name.trim()) return;

    const dateKey = selectedDate.toDateString();
    setTasks((prevTasks) => ({
      ...prevTasks,
      [dateKey]: {
        ...(prevTasks[dateKey] || {}),
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
  const handleDoneClick = () => {
    if (Object.keys(tasks).length > 0) {
      setShowCategories(true);
    }
  };

  useEffect(() => {
    if (showCategories) {
      navigate('/Categories');
    }
  }, [showCategories, navigate]);

  return (
    <div className="schedule">
   

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <h2 style={{ marginBottom: 20 }}>Schedule for {selectedDate.toDateString()}</h2>
        <Button variant="outlined" color="success" onClick={handleDoneClick} disabled={Object.keys(tasks).length === 0}>
          Done
        </Button>
      </div>

      <div className="time-grid">
        {timeSlots.map((time) => (
          <div key={time} className="time-card" onClick={() => handleAddTask(time)}>
            <div className="time-label">{time}</div>
            {tasks[selectedDate.toDateString()]?.[time] ? (
              <div className={`task ${tasks[selectedDate.toDateString()][time].type.toLowerCase()}`}>
                {tasks[selectedDate.toDateString()][time].name || 'No task'}
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
