import React, { useState, useEffect } from 'react';
import { Button, Select, MenuItem, TextField } from '@mui/material';
import './day.css';
import { useNavigate } from 'react-router-dom';

const Day = ({ day, month, year, onBack }) => {
  const navigate = useNavigate();  
  const [newTask, setNewTask] = useState({ name: '', type: 'Work' });
  const [showForm, setShowForm] = useState({ open: false, time: '' });
  const [tasks, setTasks] = useState({});
  const [showCategories, setShowCategories] = useState(false);

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const handleAddTask = (time) => {
    setShowForm({ open: true, time });
  };

  const handleSubmit = () => {
    if (!newTask.name.trim()) return;

    const dateKey = new Date(year, month - 1, day).toDateString();
    setTasks((prevTasks) => {
      const updatedTasks = {
        ...prevTasks,
        [dateKey]: {
          ...(prevTasks[dateKey] || {}),
          [showForm.time]: { name: newTask.name, type: newTask.type },
        },
      };
      return updatedTasks;
    });

    setShowForm({ open: false, time: '' });
    setNewTask({ name: '', type: 'Work' });
  };

  const selectedDate = new Date(year, month - 1, day);

  const handleDoneClick = () => {
    if (Object.keys(tasks).length > 0) {
      setShowCategories(true);
    }
  };

  // Using useEffect to handle navigation
  useEffect(() => {
    if (showCategories) {
      navigate('/Categories');  // Trigger navigation when showCategories is true
    }
  }, [showCategories, navigate]);  // Effect will run when showCategories changes

  return (
    <div className="schedule">
      <Button
        variant="contained"
        color="primary"
        onClick={onBack}
        sx={{ marginBottom: 2 }}
      >
        Back to Calendar
      </Button>

      <h2>
        Schedule for {selectedDate.toDateString()}
        <Button
          variant="outlined"
          color="success"
          onClick={handleDoneClick}
          sx={{ marginLeft: 2 }}
          disabled={Object.keys(tasks).length === 0}
        >
          Done
        </Button>
      </h2>

      <div className="time-grid">
        {timeSlots.map((time) => (
          <div
            key={time}
            className="time-card"
            onClick={() => handleAddTask(time)}
          >
            <div className="time-label">{time}</div>
            {tasks[selectedDate.toDateString()]?.[time] ? (
              <div
                className={`task ${
                  tasks[selectedDate.toDateString()][time].type.toLowerCase()
                }`}
              >
                {tasks[selectedDate.toDateString()][time].name || 'No task'}
              </div>
            ) : (
              <div className="task-placeholder">No task</div>
            )}
          </div>
        ))}
      </div>

      {showForm.open && (
        <div className="popup">
          <h3>Add Task at {showForm.time}</h3>

          <TextField
            fullWidth
            variant="outlined"
            label="Task Name"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
            sx={{ marginBottom: 2 }}
          />

          <Select
            fullWidth
            variant="outlined"
            value={newTask.type}
            onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="Work">Work</MenuItem>
            <MenuItem value="Self-care">Self-care</MenuItem>
            <MenuItem value="Chore">Chore</MenuItem>
            <MenuItem value="Workout">Workout</MenuItem>
          </Select>

          <Button variant="contained" color="success" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default Day;
