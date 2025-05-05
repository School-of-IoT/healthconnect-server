const express = require("express");

const app = express();

const {
  viewAdmin,
  fetchPatientData_ID,
  getGeoAPI
} = require('../controllers/patientControl');

const patientRoutes = express.Router();

//Important Headers for public uses
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});


patientRoutes.get("/"+adminkey, viewAdmin);
patientRoutes.get("/patient/:_id", fetchPatientData_ID);
patientRoutes.get("/geo_locate/:user", getGeoAPI);


module.exports =  patientRoutes;