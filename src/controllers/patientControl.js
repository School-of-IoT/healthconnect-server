require("dotenv").config();

const patientModel = require("../models/patientModel");

const connectDB = require("./connection");

//secret handling
const secret = process.env.CRYPTO_SECRET;
const adminkey = process.env.ADMINKEY;
const crypto = require("crypto").createHmac;

// AdminView
export const viewAdmin =  async (req, res) => {
    const patient = await patientModel.find();
    if (!patient){
        return res.json ({message: "Not Avalaible"});
    }
    return res.json({patient});
}; 


export const fetchPatientData_ID = async (req, res) => {
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


export const getGeoAPI = async (req, res) => {
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