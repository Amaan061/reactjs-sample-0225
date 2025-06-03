import React, { useState, useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null; // null for new task, string for editing
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskId }) => {
  const { addTask, updateTask, getTaskById } = useTask();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [hasReminder, setHasReminder] = useState(false);
  const [status, setStatus] = useState<'todo' | 'inProgress' | 'completed'>('todo');

  useEffect(() => {
    // If editing an existing task, populate the form
    if (taskId) {
      const task = getTaskById(taskId);
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setDueDate(task.dueDate || '');
        setPriority(task.priority || 'medium');
        setStatus(task.status);
        setHasReminder(task.hasReminder || false);
      }
    } else {
      // Reset form for new task
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setStatus('todo');
      setHasReminder(false);
    }
  }, [taskId, getTaskById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with values:', { title, description, status, priority, dueDate, hasReminder });
    
    if (!title.trim()) {
      console.log('Form submission canceled - title is empty');
      return;
    }

    if (taskId) {
      // Update existing task
      const task = getTaskById(taskId);
      if (task) {
        console.log('Updating existing task with ID:', taskId);
        updateTask(taskId, {
          title,
          description,
          dueDate,
          priority,
          status,
          hasReminder
        });
      }
    } else {
      // Add new task
      console.log('Creating new task with data:', {
        title,
        description,
        status,
        priority,
        dueDate,
        hasReminder
      });
      addTask({
        title,
        description,
        status,
        priority,
        dueDate,
        hasReminder
      });
    }
    
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        
        <form onSubmit={handleSubmit} className={styles.taskForm}>
          <h2 className={styles.modalTitle}>
            {taskId ? 'Edit Task' : 'Add Task'}
          </h2>
          
          <div className={styles.formGroup}>
            <input
              type="text"
              id="task-title"
              className={styles.formControl}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              required
              autoFocus
            />
          </div>
          
          <div className={styles.formGroup}>
            <textarea
              id="task-description"
              className={styles.formControl}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add details (supports markdown)"
              rows={5}
            />
            <div className={styles.markdownHint}>Supports markdown: **bold**, *italic*, - list, etc.</div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="due-date" className={styles.formLabel}>Due date</label>
              <input
                type="date"
                id="due-date"
                className={styles.formControl}
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="priority" className={styles.formLabel}>Priority</label>
              <select
                id="priority"
                className={styles.formControl}
                value={priority}
                onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="status" className={styles.formLabel}>Status</label>
              <select
                id="status"
                className={styles.formControl}
                value={status}
                onChange={e => setStatus(e.target.value as 'todo' | 'inProgress' | 'completed')}
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  id="reminder"
                  checked={hasReminder}
                  onChange={e => setHasReminder(e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="reminder" className={styles.checkboxLabel}>
                  Set reminder
                </label>
              </div>
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              {taskId ? 'Save Changes' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
