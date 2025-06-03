const Task = require('../models/Task');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = asyncHandler(async (req, res, next) => {
  const { title, description, status, priority, dueDate, hasReminder } = req.body;

  // Basic validation
  if (!title || title.trim() === '') {
    return next(new ErrorResponse('Please provide a task title', 400));
  }

  // Create task without list reference
  const task = await Task.create({
    title: title.trim(),
    description,
    status,
    priority,
    dueDate,
    hasReminder,
    createdBy: req.user.id
    // taskList field is now optional and we don't need to include it at all
  });

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Get all tasks for the current user
// @route   GET /api/tasks
// @access  Private
exports.getAllTasks = asyncHandler(async (req, res, next) => {
  const tasks = await Task.find({ createdBy: req.user.id });

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get a single task
// @route   GET /api/tasks/:taskId
// @access  Private
exports.getTaskById = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  const task = await Task.findOne({ _id: taskId, createdBy: req.user.id });
  
  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${taskId} or not authorized`, 404));
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Update a task
// @route   PUT /api/tasks/:taskId
// @access  Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const { title, description, status, priority, dueDate, hasReminder, completed } = req.body;

  // Find task and check ownership
  let task = await Task.findOne({ _id: taskId, createdBy: req.user.id });
  
  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${taskId} or not authorized`, 404));
  }

  // Update task
  task = await Task.findByIdAndUpdate(
    taskId,
    { title, description, status, priority, dueDate, hasReminder, completed },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
// @access  Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;

  // Find task and check ownership
  const task = await Task.findOne({ _id: taskId, createdBy: req.user.id });
  
  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${taskId} or not authorized`, 404));
  }

  // Using deleteOne instead of deprecated remove() method
  await Task.deleteOne({ _id: taskId });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Update task status only
// @route   PATCH /api/tasks/:taskId/status
// @access  Private
exports.updateTaskStatus = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  const { status } = req.body;

  if (!status || !['todo', 'inProgress', 'completed'].includes(status)) {
    return next(new ErrorResponse('Please provide a valid status', 400));
  }

  // Find task and check ownership
  let task = await Task.findOne({ _id: taskId, createdBy: req.user.id });
  
  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${taskId} or not authorized`, 404));
  }

  // Update status only
  task = await Task.findByIdAndUpdate(
    taskId,
    { status },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc    Toggle task completion
// @route   PATCH /api/tasks/:taskId/completed
// @access  Private
exports.toggleTaskCompletion = asyncHandler(async (req, res, next) => {
  const { taskId } = req.params;
  
  // Find task and check ownership
  let task = await Task.findOne({ _id: taskId, createdBy: req.user.id });
  
  if (!task) {
    return next(new ErrorResponse(`Task not found with id ${taskId} or not authorized`, 404));
  }

  // Toggle the completed status
  task = await Task.findByIdAndUpdate(
    taskId,
    { completed: !task.completed },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: task
  });
});
