require("dotenv").config();
const express = require("express");
const adminkey = process.env.ADMINKEY;

const {
        viewAdmin, fetchPatientData_ID, login, signup, 
        data, updatePatientData, deletePatientData, updateHealthData,
        getHealthData
      } = require('../controllers/patientControl');

const patientRoutes = express.Router();

// AdminOnly View
// patientRoutes.get("/"+adminkey, viewAdmin);
// TODO: Org Based Admin View

// Account - Create and Login
patientRoutes.post("/signup", signup);
patientRoutes.get("/login", login);

// Profile - View Data
patientRoutes.get("/data", data);

// Settings - Update Profile
patientRoutes.put("/update/:_id", updatePatientData);

// Permanently Delete Account
patientRoutes.delete("/delete/:_id", deletePatientData);

// Update Daily Health Data
patientRoutes.put("/health/:_id", updateHealthData);

// Get Data - QueryFilter for Graph
patientRoutes.get("/health", getHealthData);

module.exports =  patientRoutes;