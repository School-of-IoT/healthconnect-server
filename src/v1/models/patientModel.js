const mongoose = require('mongoose');

const healthDataSchema = require('./healthModel');
const deviceSchema = require('./deviceModel');

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
