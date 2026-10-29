
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must contain at least 2 characters'],
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Enter a valid email'],
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      maxlength: 30,
    },
    internship: {
      type: String,
      required: [true, 'Please select an internship'],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
