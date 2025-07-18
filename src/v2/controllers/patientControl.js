require("dotenv").config();

const patientModel = require("../../models/patientModel");
const secret = process.env.CRYPTO_SECRET;
const crypto = require("crypto").createHmac;

// Firebase Admin initialization
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        type: process.env.FIREBASE_TYPE,
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI,
        token_uri: process.env.FIREBASE_TOKEN_URI,
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
        client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
        universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    })
});


function getJIT_Auth(valpass) {
  let date_ob = new Date();
  let moment = date_ob.getDate()+'-'+date_ob.getMonth()+'/'+date_ob.getHours();
  let token = process.env.CRYPTO_TOKEN + moment;
  let auth_token = crypto("sha256", token).update(valpass).digest("hex");
  return auth_token;
}


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


// GET
// route: /login
// description: To get JIT token with 'user' & 'pass'
// q-parameter: username and password
const login = async (req, res) => {
    try {
        const body = req.query;
        const pass = body.pass;
        const user = body.user;
        const patient_pass = await crypto("sha256", secret).update(pass).digest("hex");
        const patient = await patientModel.find({user: user, pass: patient_pass});
        const check = (patient == []);
      
        if (!check){    
            const valpass = patient[0].pass;
            const valuser = patient[0].user;   
            
            if ((valpass == patient_pass) && (valuser == user)){
                const uid = patient[0]._id;
                //JIT(Just-in-time) handler
                var date_ob = new Date();
                var moment = date_ob.getDate()+'-'+date_ob.getMonth()+'/'+date_ob.getHours();
                const token = process.env.CRYPTO_TOKEN + moment;
                const auth_token = await crypto("sha256", token).update(valpass).digest("hex");
                return res.json({token: auth_token});
            }
            else{
                return res.status(500).json({error: error.message});
            }
        }   
        else{
            return res.status(500).json({error: error.message});
        }    
        return res.json (patient);
    } 
    catch(error) {
        return res.status(500).json({error: error.message});
    }
};



// GET
// route: /data
// description: To get patient data with 'user' & 'token'
// q-parameter: user & token (generated by respose during login)
const data = async (req, res) => {
    
    try{
        const body = req.query;
        const user = body.user;
        const ch_token = body.token;
        const patient = await patientModel.find({user: user});
        
        if (!patient){
            return res.status(500).json ({message: "No Data Found"});
        }
        else{
            const valpass = patient[0].pass;
            //JIT(Just-in-time) handler
            var date_ob = new Date();
            var moment = date_ob.getDate()+'-'+date_ob.getMonth()+'/'+date_ob.getHours();
            const token = process.env.CRYPTO_TOKEN + moment;
            const auth_token = await crypto("sha256", token).update(valpass).digest("hex");
          
            if (auth_token == ch_token)
            {
              return res.json ({ patient });
            }
            else{
              return res.status(500).json ({message: "Token does not match. Try to Login Again."});
            }
        }    
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }    
};


const getSimplifiedPatient = (originalPatient) => {
  const patient = originalPatient.patient[0];

  const latestValue = (arr) => {
    if (Array.isArray(arr) && arr.length > 0 && arr[arr.length - 1].value !== undefined) {
      return arr[arr.length - 1].value;
    }
    return null;
  };

  const simplifiedPatient = {
    _id: patient._id,
    Name: patient.Name,
    Age: patient.Age,
    Sex: patient.Sex,
    Address: patient.Address,
    Contacts: patient.Contacts,
    BGroup: patient.BGroup,
    BMI: patient.BMI,
    HeartRate: patient.HeartRate,
    Ambulation: patient.Ambulation,
    Chills: patient.Chills,
    DecreasedMood: patient.DecreasedMood,
    GeneralizedFatigue: patient.GeneralizedFatigue,
    HistoryFever: patient.HistoryFever,
    RecentHospitalStay: patient.RecentHospitalStay,
    WeightGain: patient.WeightGain,
    WeightLoss: patient.WeightLoss,
    user: patient.user,
    devtoken: patient.devtoken,
    devices: patient.devices,
    latestHealthData: {
      SBP: latestValue(patient.healthData?.SBP),
      DBP: latestValue(patient.healthData?.DBP),
      RR: latestValue(patient.healthData?.RR),
      FiO2: latestValue(patient.healthData?.FiO2),
      SpO2: latestValue(patient.healthData?.SpO2),
      Temp: latestValue(patient.healthData?.Temp),
      StepCount: latestValue(patient.healthData?.StepCount),
      Water: latestValue(patient.healthData?.Water),
      sleepHours: latestValue(patient.healthData?.sleepHours),
      BPM: latestValue(patient.healthData?.BPM),
      HRV: latestValue(patient.healthData?.HRV)
    }
  };

  return simplifiedPatient;
};

// GET
// route: /data
// description: To get patient data with 'user' & 'token'
// q-parameter: user & token (generated by respose during login)
const lastdata = async (req, res) => {
    
    try{
        const body = req.query;
        const user = body.user;
        const ch_token = body.token;
        var patient = await patientModel.find({user: user});
        
        if (!patient){
            return res.status(500).json ({message: "No Data Found"});
        }
        else{
            const valpass = patient[0].pass;
            //JIT(Just-in-time) handler
            var date_ob = new Date();
            var moment = date_ob.getDate()+'-'+date_ob.getMonth()+'/'+date_ob.getHours();
            const token = process.env.CRYPTO_TOKEN + moment;
            const auth_token = await crypto("sha256", token).update(valpass).digest("hex");
          
            if (auth_token == ch_token)
            {
              // return res.json ({ patient });
              try {
                if (!patient) {
                  return res.status(404).json({ message: "No patient data found" });
                }
                var patient = getSimplifiedPatient({ patient });
                return res.json ({ patient });
                
              } catch (error) {
                console.error("Error fetching patient data:", error);
                return res.status(500).json({ message: error.message });
              }
            }
            else{
              return res.status(500).json ({message: "Token does not match. Try to Login Again."});
            }
        }    
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }    
};


// POST
// route: /patient/signup
// description: To add new patient
// request body: patient object
// v1Route.post("/patient/signup",
const signup = async(req, res) => {

    try {
        var { newpatient } = req.body;

        // Ensure name, user, and pass are provided
        if (!newpatient || !newpatient.name || !newpatient.user || !newpatient.pass) {
            return res.status(400).json({ error: "Missing required fields: name, username, and password" });
        }

        const pass = newpatient.pass;
        const user = newpatient.user;
        const username_check = await patientModel.find({ user: user });
        
        if (!(username_check[0] === undefined)) {
            return res.status(400).json({ error: "Username already exists" });
        }
      
        const patient_pass = await crypto("sha256", secret).update(pass).digest("hex");
        await patientModel.create(newpatient);
        const filter = { user: user };
        const update = { pass: patient_pass };

        let doc = await patientModel.findOneAndUpdate(filter, update, {
            new: true
        });

        const { _id } = doc;
        return res.json({ message: "Patient Created", uid: _id });
    } 
    catch(error) {
        return res.status(500).json({ error: error.message });
    }
};



// PUT
// route: /patient/update/:_id
// description: To update a patient
// e-parameter: _id 
// request body: patient object
const updatePatientData = async (req, res) => {

    try {
        const { _id } = req.params;
        const { patientData } = req.body;
        const updatepatient = await patientModel.findByIdAndUpdate(
            _id,
            { $set: patientData},
            { new: true}     
        );
        return res.json({ message: "Patient Data updated!" });
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
       
};



// DELETE
// route: /patient/delete/:_id
// description: To delete a patient
const deletePatientData = async (req, res) => {
    try{
        const { _id } = req.params;
        await patientModel.findByIdAndDelete(_id);
        return res.json({message: "Patient Deleted 🔪"});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
};

const updateHealthData = async (req, res) => {
  try {
      const { _id } = req.params;
      const { healthData } = req.body;
      const token = req.headers['token'];
  
      if (!healthData || Object.keys(healthData).length === 0) {
        return res.status(400).json({ error: "Invalid or empty health data" });
      }
  
      const patient = await patientModel.findById(_id);
  
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
      let valpass = patient.pass;
      let auth_token = getJIT_Auth(valpass);
      if (auth_token == token){
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
    
        await patient.save();
        
        return res.json({ message: "Health Updated 💙" });
      }
      else{
        return res.status(500).json ({message: "Token does not match. Try to Login Again."});
      }
      
  
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
};



const getHealthData = async (req, res) => {
  const AuthType = req.headers['authtype'];
  if (AuthType == 'JIT'){
    var ch_token = req.headers['token'];
    var user = req.headers['user'];
    var patient = await patientModel.findOne({user: user});
    if (!patient) {
      return res.status(404).json({ message: "No patient data found" });
    }
    else{
      let auth_token = getJIT_Auth(patient.pass);
      if (auth_token != ch_token){
        return res.status(500).json ({message: "Token does not match. Try to Login Again."});
      }
    }
    
  }
  else{
    var ch_token = req.headers.authorization?.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(ch_token);
    const userEmail = decodedToken.email;

    if (!userEmail) {
      return res.status(400).json({ message: "Email not found in token" });
    }
    var patient = await patientModel.findOne({ Email: userEmail });
  }
  
  if (!ch_token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    if (!patient) {
      return res.status(404).json({ message: "No patient data found" });
    }
    const { from, to, q } = req.query;
    let fromDate, toDate;
    if (q === "dashboard") {
      toDate = new Date();
      fromDate = new Date();
      fromDate.setDate(toDate.getDate() - 7);
    } else if (from && to) {
      fromDate = new Date(from);
      toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999); // Include full 'to' day
    }

    if (fromDate && toDate) {
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
      return res.json(health);
    } else {
      // No filtering
      return res.status(201).json({  message: "No data found" });
    }

  } catch (error) {
    console.error("Error fetching patient data:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { viewAdmin,fetchPatientData_ID, login, signup, data, 
                   updatePatientData, deletePatientData, updateHealthData,
                   getHealthData, lastdata
                 }