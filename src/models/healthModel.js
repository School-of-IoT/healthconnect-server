const mongoose = require('mongoose');

// Define a schema for tracking attributes with a date
const attributeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
}, { _id: false });


// Health Data Schema
const healthDataSchema = new mongoose.Schema({
  ECG: { type: [attributeSchema], default: [] },
  SBP: { type: [attributeSchema], default: [] },
  RR: { type: [attributeSchema], default: [] },
  HRV: { type: [attributeSchema], default: [] },
  DBP: { type: [attributeSchema], default: [] },
  FiO2: { type: [attributeSchema], default: [] },
  SpO2: { type: [attributeSchema], default: [] },
  Temp: { type: [attributeSchema], default: [] },
  StepCount: { type: [attributeSchema], default: [] },
  Water: { type: [attributeSchema], default: [] },
  sleepHours: { type: [attributeSchema], default: [] },
  BPM: { type: [attributeSchema], default: [] }
}, { _id: false });

module.exports = healthDataSchema;