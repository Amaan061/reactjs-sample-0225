import React, { useState, useRef } from 'react';
import styles from './TaskBoard.module.css';
import { useTask, Task } from '../../context/TaskContext';

interface TaskBoardProps {
  onAddTask: () => void;
  onEditTask: (taskId: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ onAddTask, onEditTask }) => {
  const { tasks, toggleTaskCompletion, moveTask, removeTask } = useTask();
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [taskStatus, setTaskStatus] = useState<'todo' | 'inProgress' | 'completed'>('todo');
  const dragCounter = useRef<Record<string, number>>({ todo: 0, inProgress: 0, completed: 0 });

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    // Reset drag counter
    dragCounter.current = { todo: 0, inProgress: 0, completed: 0 };
  };

  const handleDragEnter = (status: 'todo' | 'inProgress' | 'completed') => {
    dragCounter.current[status] += 1;
    setTaskStatus(status);
  };

  const handleDragLeave = (status: 'todo' | 'inProgress' | 'completed') => {
    dragCounter.current[status] -= 1;
  };

  const handleDrop = (status: 'todo' | 'inProgress' | 'completed') => {
    if (draggedTask) {
      // Only update if status changed
      if (draggedTask.status !== status) {
        moveTask(draggedTask.id, status);
      }
    }
    // Reset drag counter
    dragCounter.current = { todo: 0, inProgress: 0, completed: 0 };
  };

  const renderTaskCard = (task: Task) => (
    <div
      key={task.id}
      className={`${styles.taskCard} ${
        task.priority === 'high' ? styles.highPriority : 
        task.priority === 'medium' ? styles.mediumPriority : styles.lowPriority
      }`}
      draggable
      onDragStart={() => handleDragStart(task)}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.taskHeader}>
        <button
          className={styles.taskCheckbox}
          onClick={(e) => {
            e.stopPropagation();
            toggleTaskCompletion(task.id);
          }}
        >
          {task.completed ? <span className={styles.checkIcon}>✓</span> : <span>○</span>}
        </button>
        <h3 
          className={`${styles.taskTitle} ${task.completed ? styles.completedTask : ''}`}
          onClick={() => onEditTask(task.id)}
        >
          {task.title}
        </h3>
        <div className={styles.taskActions}>
          <button 
            className={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task.id);
            }}
          >
            <span>Edit</span>
          </button>
          <button 
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Are you sure you want to delete task: ${task.title}?`)) {
                removeTask(task.id);
              }
            }}
          >
            <span>Delete</span>
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className={styles.taskDescription}>
          {task.description.length > 100 
            ? `${task.description.substring(0, 100)}...` 
            : task.description}
        </p>
      )}
      
      <div className={styles.taskFooter}>
        {task.dueDate && (
          <div className={styles.taskMeta}>
            <span className={styles.metaIcon}>📅</span>
            <span className={styles.dueDate}>
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}
        
        {task.hasReminder && (
          <div className={styles.taskMeta}>
            <span className={styles.metaIcon}>🔔</span>
            <span>Reminder set</span>
          </div>
        )}

        <div className={`${styles.priorityBadge} ${styles[task.priority || 'medium']}Priority`}>
          {task.priority || 'medium'}
        </div>
      </div>
    </div>
  );

  const renderTaskColumn = (title: string, tasks: Task[], status: 'todo' | 'inProgress' | 'completed') => {
    const isOver = draggedTask && taskStatus === status;
    
    return (
      <div 
        className={`${styles.column} ${isOver ? styles.dropTarget : ''}`}
        onDragEnter={() => handleDragEnter(status)}
        onDragLeave={() => handleDragLeave(status)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDrop(status)}
      >
        <div className={styles.columnHeader}>
          <h2>{title}</h2>
          <span className={styles.taskCount}>{tasks.length}</span>
        </div>
        
        <div className={styles.taskList}>
          {tasks.length > 0 ? (
            tasks.map(task => renderTaskCard(task))
          ) : (
            <div className={styles.emptyState}>
              <p>No tasks yet</p>
              {status === 'todo' && (
                <button className={styles.addTaskButton} onClick={onAddTask}>
                  Add a task
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.taskBoard}>
      <div className={styles.boardHeader}>
        <h1 className={styles.boardTitle}>My Tasks</h1>
        <button className={styles.addTaskButton} onClick={onAddTask}>
          <span className={styles.addIcon}>+</span>
          Add a task
        </button>
      </div>
      
      <div className={styles.columns}>
        {renderTaskColumn('To Do', todoTasks, 'todo')}
        {renderTaskColumn('In Progress', inProgressTasks, 'inProgress')}
        {renderTaskColumn('Completed', completedTasks, 'completed')}
      </div>
    </div>
  );
};

export default TaskBoard;
