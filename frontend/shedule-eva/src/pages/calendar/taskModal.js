import React from 'react';
import { Modal, Box, Button, Select, MenuItem, TextField, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';

const TaskModal = ({ open, time, newTask, setNewTask, handleSubmit, handleClose }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          p: 4,
          backgroundColor: 'white',
          maxWidth: 400,
          margin: 'auto',
          mt: 10,
          borderRadius: 2,
          position: 'relative',
          boxShadow: 3,
        }}
      >

        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>


        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          Create Task
        </Typography>

  
        <Box display="flex" alignItems="center" mb={2}>
          <AccessTimeFilledIcon sx={{ fontSize: 18, color: 'gray', mr: 1 }} />
          <Typography variant="body1" color="textSecondary">
            {time}
          </Typography>
        </Box>


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
          <MenuItem value="Other">Other</MenuItem>
        </Select>

        {/* Save Button */}
        <Button variant="contained" color="success" fullWidth onClick={handleSubmit}>
          Save
        </Button>
      </Box>
    </Modal>
  );
};

export default TaskModal;
