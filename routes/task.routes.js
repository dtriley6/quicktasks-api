const express = require('express');
const router = express.Router();
const Task = require('../models/task.model');

// Create a task
router.post('/', async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const task = new Task({ title, description, tags });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
