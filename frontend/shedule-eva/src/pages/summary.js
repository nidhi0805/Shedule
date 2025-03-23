import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, List, ListItem, Divider, Box } from '@mui/material';
import './SummaryPage.css';

const SummaryPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date());

 
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

      console.log('API Response:', response.data);

      if (response.data && response.data.activities) {
        setTasks(response.data.activities.filter((task) => task !== null));
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

  return (
    <Box className="summary-container">
      <Card className="sticky-note">
        {/* Sticky Pin */}
        <div className="sticky-pin" />

        <CardContent>
          {/* Date Header */}
          <Typography className="summary-date">
            📅 {formattedDate}
          </Typography>

          {/* Loading State */}
          {loading && (
            <Typography className="summary-loading">
              Loading tasks...
            </Typography>
          )}

          {/* Error State */}
          {!loading && error && (
            <Typography className="summary-error">
              {error}
            </Typography>
          )}

          {/* Number of Tasks */}
          {!loading && !error && (
            <Typography className="summary-task-count">
              {tasks.length > 0
                ? `${tasks.length} task${tasks.length > 1 ? 's' : ''} scheduled`
                : 'No tasks scheduled'}
            </Typography>
          )}

          <Divider className="summary-divider" />

          {/* List of Tasks */}
          {!loading && !error && tasks.length > 0 ? (
            <List className="task-list">
              {tasks.map((task, index) => (
                <ListItem key={index} className="summary-task">
                  {task}
                </ListItem>
              ))}
            </List>
          ) : (
            !loading &&
            !error && (
              <Typography className="summary-no-tasks">
                You have no tasks for this day.
              </Typography>
            )
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SummaryPage;
