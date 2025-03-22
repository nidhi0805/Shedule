import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

const TaskModal = ({ isOpen, onClose, onSave, task, date, hour = 8 }) => {
  const taskDate = new Date(date);
  taskDate.setHours(hour, 0, 0, 0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: taskDate.toISOString(),
      duration: 30,
      color: '#9370DB',
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        date: task.date,
        duration: task.duration,
        color: task.color || '#9370DB',
      });
    } else {
      reset({
        title: '',
        description: '',
        date: taskDate.toISOString(),
        duration: 30,
        color: '#9370DB',
      });
    }
  }, [task, taskDate, reset]);

  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Task Title</label>
          <input {...register('title', { required: true })} placeholder="Enter title" />
          {errors.title && <p className="error">Title is required</p>}

          <label>Description</label>
          <textarea {...register('description')} placeholder="Enter description" />

          <label>Date</label>
          <p>{format(new Date(watch('date')), 'EEEE, MMMM d, yyyy')}</p>

          <label>Duration (minutes)</label>
          <select {...register('duration')}>
            {[15, 30, 45, 60, 90, 120].map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{task ? 'Update Task' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
