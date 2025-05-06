require("dotenv").config();

const patientModel = require("../models/patientModel");

const connectDB = require("../../../connection");

//secret handling
const secret = process.env.CRYPTO_SECRET;
const adminkey = process.env.ADMINKEY;
const crypto = require("crypto").createHmac;

// AdminView
const viewAdmin =  async (req, res) => {
    const patient = await patientModel.find();
    if (!patient){
        return res.json ({message: "Not Avalaible"});
    }
    return res.json({patient});
}; 


const fetchPatientData_ID = async (req, res) => {
    try{
        const { _id } = req.params;
        const patient = await patientModel.findById(_id);
        if (!patient){
            return res.json ({message: "invalid ID"});
        }
        return res.json ({ patient });
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }    
};


const getGeoAPI = async (req, res) => {
    try{
        const { user } = req.params;
        const patient = await patientModel.find({user: user});
        if (!patient){
            return res.json ({message: "invalid user"});
        }
        let api = process.env.GEO_API;
        return res.json ({geo_api: api});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }   
};





// PUT
// route: /update-health/:_id
// description: Update health attributes (StepCount, Water, sleepHours, BPM)
// e-parameter: _id 
// request body: healthData object
v1Route.put("/update-health/:_id", async (req, res) => {
    try {
      const { _id } = req.params;
      const { healthData } = req.body;
  
      if (!healthData || Object.keys(healthData).length === 0) {
        return res.status(400).json({ error: "Invalid or empty health data" });
      }
  
      const patient = await patientModel.findById(_id);
  
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
  
      // Update healthData
      Object.keys(healthData).forEach((key) => {
        if (Array.isArray(healthData[key])) {
          healthData[key].forEach((item) => {
            if (!item.date || item.value === undefined) {
              throw new Error(`Invalid data for ${key}. Each entry must have 'date' and 'value'.`);
            }
            patient.healthData[key].push(item);
          });
        }
      });
  
      const updatedPatient = await patient.save();
      
      return res.json({ message: "Health Updated 💙" });
  
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });


  v1Route.get("/med-data", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      const userEmail = decodedToken.email;
  
      if (!userEmail) {
        return res.status(400).json({ message: "Email not found in token" });
      }
  
      const patient = await patientModel.findOne({ Email: userEmail });
  
      if (!patient) {
        return res.status(404).json({ message: "No patient data found" });
      }
  
      const { from, to, q } = req.query;
    //   console.log("Incoming Query:", { from, to, q });
  
      let fromDate, toDate;
  
        if (q === "dashboard") {
        toDate = new Date();
        fromDate = new Date();
        fromDate.setDate(toDate.getDate() - 7);
      } else if (from && to) {
        fromDate = new Date(from);
        toDate = new Date(to);
      }
  
      if (fromDate && toDate) {
        // console.log("From Date:", fromDate);
        // console.log("To Date:", toDate);

        const health = {};
        const healthData = patient.healthData || {};
  
        for (const key in healthData) {
          if (Array.isArray(healthData[key])) {
            health[key] = healthData[key].filter(item => {
              const itemDate = new Date(item.date);
              return itemDate >= fromDate && itemDate <= toDate;
            });
          }
        }
  
        console.log("Filtered Health Data:", health);

  
        return res.json(health);
      } else {
        // No filtering
        return res.status(201).json({  message: "No data found" });
      }
  
    } catch (error) {
      console.error("Error fetching patient data:", error);
      return res.status(500).json({ message: error.message });
    }
  });


  
module.exports = {viewAdmin,fetchPatientData_ID, getGeoAPI}