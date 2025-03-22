const mongoose = require('mongoose');

// Define a strict schema for devices
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
  }
}, { _id: false, strict: true });

// Main schema with embedded devices
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
  DBP: Number,
  DecreasedMood: Boolean,
  FiO2: Number,
  GeneralizedFatigue: Boolean,
  HeartRate: Number,
  HistoryFever: String,
  RR: Number,
  RecentHospitalStay: String,
  SBP: Number,
  SpO2: Number,
  Temp: Number,
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
  ecg: [{}]
}, { strict: true }); // Prevents adding unexpected fields

const patientModel = mongoose.model("Patient_Data", patientSchema);

module.exports = patientModel;
