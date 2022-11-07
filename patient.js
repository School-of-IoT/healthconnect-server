const mongoose = require('mongoose');

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
    devices: [{ node: String, type: String, attribute: String, lastUp: String }]
    });

const patientModel = mongoose.model("Patient_Data", patientSchema);

module.exports = patientModel;
