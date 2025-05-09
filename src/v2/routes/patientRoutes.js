require("dotenv").config();
const express = require("express");
const adminkey = process.env.ADMINKEY;

const {
        viewAdmin, fetchPatientData_ID, login, signup, 
        data, updatePatientData, deletePatientData, updateHealthData,
        getHealthData
      } = require('../controllers/patientControl');

const patientRoutes = express.Router();


// patientRoutes.get("/"+adminkey, viewAdmin);

patientRoutes.post("/signup", signup);
patientRoutes.get("/login", login);

// patientRoutes.get("/data", data);
// patientRoutes.get("/patient/:_id", fetchPatientData_ID);

// Settings - Update Profile
patientRoutes.put("/update/:_id", updatePatientData);

// Permanently Delete Account
patientRoutes.delete("/delete/:_id", deletePatientData);

// Update Daily Health Data
patientRoutes.put("/health/:_id", updateHealthData);

// Get Data - QueryFilter for Graph
patientRoutes.get("/health", getHealthData)

module.exports =  patientRoutes;