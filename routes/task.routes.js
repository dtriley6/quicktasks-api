const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');
const { createTaskSchema, taskUpdate } = require('../validators/task.schemas');
const auth = require('../middlewares/auth');

router.use(auth);


// Create a task
router.post('/', async (req, res) => {
  try {
    const parsed = createTaskSchema.parse(req.body); // validate here

    const task = new Task({ ...parsed, userId: req.user.id });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get all tasks with pagination and tag filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const tagFilter = req.query.tags
      ? { tags: { $in: req.query.tags.split(',') } }
      : {};

    const tasks = await Task.find(tagFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // newest first

    const total = await Task.countDocuments(tagFilter);

    res.json({
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID' });
  }
});

// PUT (update) task
router.put('/:id', async (req, res) => {
  try {
    const updates = taskUpdate.parse(req.body);
    const updated = await Task.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Task not found' });
    res.json(updated);
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: err.errors });
    }
    res.status(400).json({ error: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


module.exports = router;
