import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, List, ListItem, Divider, Box } from '@mui/material';
import { Note, AttachFile, CheckCircle } from '@mui/icons-material';
import './SummaryPage.css';

const SummaryPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completionStatus, setCompletionStatus] = useState([]); // ✅ Initialized as empty array
  const [userEmail, setUserEmail] = useState(null);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today
    .getDate()
    .toString()
    .padStart(2, '0')}`;

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('userEmail');
    setUserEmail(storedEmail);

    if (storedEmail) {
      fetchTasks(storedEmail, formattedDate);
      fetchStatus(storedEmail, formattedDate);
    }
  }, []);

  const fetchTasks = async (email, date) => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-user-activity/${email}/${date}`);

      if (response.data && response.data.activities) {
        const filteredTasks = response.data.activities.filter((task) => task !== null);
        setTasks(filteredTasks);
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

  const fetchStatus = async (email, date) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/get-activity-status/${email}/${date}`);
      if (response.data && response.data.status) {
        setCompletionStatus(response.data.status);
      } else {
        setCompletionStatus(new Array(24).fill(0));
      }
    } catch (err) {
      console.error('Error fetching status:', err);
      setCompletionStatus(new Array(24).fill(0));
    }
  };

  const handleCheckboxChange = async (index) => {
    if (completionStatus[index] === 1) return;

    const newCompletionStatus = [...completionStatus];
    newCompletionStatus[index] = 1;
    setCompletionStatus(newCompletionStatus);

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/update-activity-status`, {
        email: userEmail,
        date: formattedDate,
        status: newCompletionStatus,
      });
      console.log('Status updated successfully');
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const remainingTasksCount =
    completionStatus && tasks
      ? tasks.reduce(
          (count, _, index) => (completionStatus[index] === 0 ? count + 1 : count),
          0
        )
      : 0;

  return (
    <Box className="summary-container">
      <Card className="sticky-note">
        <AttachFile className="paperclip-icon" />
        <CardContent>
          <Typography className="summary-date">
            {today.getDate()} {months[today.getMonth()]} {today.getFullYear()}
          </Typography>

          {/* Loading */}
          {loading && <Typography className="summary-loading">Loading tasks...</Typography>}

          {/* Error */}
          {!loading && error && <Typography className="summary-error">{error}</Typography>}

          {/* Task Count */}
          {!loading && !error && completionStatus.length > 0 && (
            <Typography className="summary-task-count">
              {remainingTasksCount > 0
                ? `${remainingTasksCount} task${remainingTasksCount > 1 ? 's' : ''} left`
                : 'All tasks completed! 🎉'}
            </Typography>
          )}

          <Divider className="summary-divider" />

          {/* Task List */}
          {!loading && !error && tasks.length > 0 && completionStatus.length > 0 && (
            <List className="task-list">
              {tasks.map((task, index) => (
                <ListItem
                  key={index}
                  className={`summary-task ${completionStatus[index] ? 'completed' : ''}`}
                >
                  <div className="task-checkbox-container">
                    <input
                      type="checkbox"
                      className="task-checkbox"
                      checked={completionStatus[index] === 1}
                      disabled={completionStatus[index] === 1}
                      onChange={() => handleCheckboxChange(index)}
                    />
                    {completionStatus[index] === 1 && (
                      <CheckCircle className="check-icon" />
                    )}
                  </div>
                  {task}
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SummaryPage;
