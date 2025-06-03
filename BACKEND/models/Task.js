const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters'] // Increased for markdown
  },
  status: {
    type: String,
    enum: ['todo', 'inProgress', 'completed'], // Updated enum
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  hasReminder: {
    type: Boolean,
    default: false
  },
  taskList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TaskList',
    // No longer required as we're moving to a list-free structure
    required: false
  },
  createdBy: { // User who created this specific task
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must have a creator']
  }
}, { timestamps: true }); // Adds createdAt and updatedAt

module.exports = mongoose.model('Task', TaskSchema);
