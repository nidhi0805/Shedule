import React, { useState } from 'react';
import './day.css';
const Day = ({ day, month, year, onBack }) => {
  const [newTask, setNewTask] = useState({ name: '', type: 'Work' });
  const [showForm, setShowForm] = useState({ open: false, time: '' });
  const [tasks, setTasks] = useState({});

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const handleAddTask = (time) => {
    setShowForm({ open: true, time });
  };

  const handleSubmit = () => {
    const dateKey = new Date(year, month - 1, day).toDateString();
    setTasks((prevTasks) => ({
      ...prevTasks,
      [dateKey]: {
        ...prevTasks[dateKey],
        [showForm.time]: { name: newTask.name, type: newTask.type },
      },
    }));
    setShowForm({ open: false, time: '' });
    setNewTask({ name: '', type: 'Work' });
  };

  const selectedDate = new Date(year, month - 1, day);

  
    return (
        <div className="schedule">
            <button onClick={onBack}>Back to Calendar</button>

          <h2>Schedule for {selectedDate.toDateString()}</h2>
          <div className="time-grid">
            {timeSlots.map((time) => (
              <div
                key={time}
                className="time-card"
                onClick={() => handleAddTask(time)}
              >
                <div className="time-label">{time}</div>
                {tasks[selectedDate.toDateString()]?.[time] ? (
                  <div className={`task ${tasks[selectedDate.toDateString()][time].type.toLowerCase()}`}>
                    {tasks[selectedDate.toDateString()][time].name}
                  </div>
                ) : (
                  <div className="task-placeholder">No task</div>
                )}
              </div>
            ))}
          </div>
      
          {showForm.open && (
            <div className="popup">
              <h3>Add Task @ {showForm.time}</h3>
              <input
                placeholder="Task Name"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
              />
              <select
                value={newTask.type}
                onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
              >
                <option>Work</option>
                <option>Self-care</option>
                <option>Chore</option>
                <option>Workout</option>
              </select>
              <button onClick={handleSubmit}>Save</button>
            </div>
          )}
      
        
        </div>
      );
      
};

export default Day;
