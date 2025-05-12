const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
  tags: [String],
}, {
  timestamps: true // adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('Task', taskSchema);
