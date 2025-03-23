import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, List, ListItem, Divider, Box } from '@mui/material';
import './SummaryPage.css';

const SummaryPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date());
  const [completionStatus, setCompletionStatus] = useState(new Array(24).fill(0));

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York',
  });

  useEffect(() => {
    const isoDate = date.toISOString().split('T')[0];
    fetchTasks('ananya@example.com', isoDate);
  }, [date]);

  const fetchTasks = async (email, date) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`http://localhost:5000/api/get-user-activity/${email}/${date}`);

      if (response.data && response.data.activities) {
        const filteredTasks = response.data.activities.filter((task) => task !== null);
        setTasks(filteredTasks);

        const newCompletionStatus = new Array(24).fill(0);
        filteredTasks.forEach((task, index) => {
          if (task.completed) newCompletionStatus[index] = 1;
        });
        setCompletionStatus(newCompletionStatus);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setTasks([]);
      setError('No tasks found for this date.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (index) => {
    if (completionStatus[index] === 1) return;

    const newCompletionStatus = [...completionStatus];
    newCompletionStatus[index] = 1;
    setCompletionStatus(newCompletionStatus);
  };

  const remainingTasksCount = tasks.reduce(
    (count, _, index) => (completionStatus[index] === 0 ? count + 1 : count),
    0
  );

  return (
    <Box className="summary-container">
      <Card className="sticky-note">
        <div className="sticky-pin" />
        <CardContent>
          <Typography className="summary-date">📅 {formattedDate}</Typography>

          {loading && <Typography className="summary-loading">Loading tasks...</Typography>}
          {!loading && error && <Typography className="summary-error">{error}</Typography>}

          {!loading && !error && (
            <Typography className="summary-task-count">
              {remainingTasksCount > 0
                ? `${remainingTasksCount} task${remainingTasksCount > 1 ? 's' : ''} left`
                : 'All tasks completed! 🎉'}
            </Typography>
          )}

          <Divider className="summary-divider" />

          <List className="task-list">
            {tasks.map((task, index) => (
              <ListItem key={index} className={`summary-task ${completionStatus[index] ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={completionStatus[index] === 1}
                  disabled={completionStatus[index] === 1}
                  onChange={() => handleCheckboxChange(index)}
                />
                {task}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SummaryPage;
