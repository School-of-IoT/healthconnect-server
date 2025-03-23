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

// Define the device schema
const deviceSchema = new mongoose.Schema({
  node: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  attribute: {
    type: String,
    required: true
  },
  lastUp: {
    type: String,
    required: true
  },
  battery: {
    type: String,
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

// Main schema for the patient
const patientSchema = new mongoose.Schema({
  Name: String,
  Address: String,
  Email: String,
  DOB: String,
  Age: Number,
  Ambulation: Boolean,
  BMI: Number,
  Chills: Boolean,
  Contacts: String,
  DecreasedMood: Boolean,
  GeneralizedFatigue: Boolean,
  HistoryFever: String,
  RecentHospitalStay: String,
  WeightGain: Number,
  WeightLoss: Number,
  BGroup: String,
  Sex: String,
  pass: String,
  user: String,
  devtoken: String,
  devices: {
    type: [deviceSchema],
    default: []
  },
  healthData: {
    type: healthDataSchema,
    default: () => ({})
  }
}, { strict: true });

const patientModel = mongoose.model("Patient_Data", patientSchema);

module.exports = patientModel;
