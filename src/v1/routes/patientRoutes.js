require("dotenv").config();
const express = require("express");
const adminkey = process.env.ADMINKEY;

const {
        viewAdmin, fetchPatientData_ID, getGeoAPI, login, signup, data, updatePatientData, deletePatientData
      } = require('../controllers/patientControl');

const patientRoutes = express.Router();


patientRoutes.get("/"+adminkey, viewAdmin);
patientRoutes.get("/geo_locate/:user", getGeoAPI);

patientRoutes.get("/patient/signup", signup);
patientRoutes.get("/login", login);

patientRoutes.get("/data", data);
patientRoutes.get("/patient/:_id", fetchPatientData_ID);

patientRoutes.get("/patient/update/:_id", updatePatientData);
patientRoutes.get("/patient/delete/:_id", deletePatientData);


module.exports =  patientRoutes;