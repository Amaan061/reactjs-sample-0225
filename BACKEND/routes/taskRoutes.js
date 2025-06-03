const express = require('express');
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  toggleTaskCompletion
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .post(createTask)      // POST /api/tasks
  .get(getAllTasks);     // GET /api/tasks

router.route('/:taskId')
  .get(getTaskById)      // GET /api/tasks/:taskId
  .put(updateTask)       // PUT /api/tasks/:taskId
  .delete(deleteTask);   // DELETE /api/tasks/:taskId

router.route('/:taskId/status')
  .patch(updateTaskStatus); // PATCH /api/tasks/:taskId/status

router.route('/:taskId/completed')
  .patch(toggleTaskCompletion);  // PATCH /api/tasks/:taskId/completed

module.exports = router;
