//Connections

require("dotenv").config();
const express = require("express");
const connectDB = require("./connection");
const patientModel = require("./patient");
const admin = require('firebase-admin');

// Firebase Admin initialization
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


//secret handling
const secret = process.env.CRYPTO_SECRET;
const adminkey = process.env.ADMINKEY;
const crypto = require("crypto").createHmac;

const app = express();

//Important Headers for public uses
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// configuration
app.use(express.json());


// GET
// route: /<adminkey>
// description: User's Master Data
// e-parameter: Admin Key accessible and regenerated by maintainer 
app.get("/"+adminkey, async (req, res) => {
    
    const patient = await patientModel.find();
    if (!patient){
            return res.json ({message: "Not Avalaible"});
        }
    return res.json({patient});
}); 


// GET
// route: /patient/:_id
// description: To get patient with 'id'
// e-parameter: _id 
app.get("/patient/:_id", async (req, res) => {
    
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
});


// GET
// route: /geo_locate/:user
// description: To get Geo-API key, used for third party API service
// e-parameter: user 
app.get("/geo_locate/:user", async (req, res) => {
    
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
});



  
// GET
// route: /login
// description: To get JIT token with 'user' & 'pass'
// q-parameter: username and password
app.get("/login", async (req, res) => {
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
});



// GET
// route: /data
// description: To get patient data with 'user' & 'token'
// q-parameter: user & token (generated by respose during login)
app.get("/data", async (req, res) => {
    
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
});




// POST
// route: /patient/signup
// description: To add new patient
// request body: patient object
app.post("/patient/signup", async(req, res) => {

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
});



// PUT
// route: /patient/update/:_id
// description: To update a patient
// e-parameter: _id 
// request body: patient object
app.put("/patient/update/:_id", async (req, res) => {

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
       
});





// PUT
// route: /patient/update-health/:_id
// description: Update health attributes (StepCount, Water, sleepHours, BPM)
// e-parameter: _id 
// request body: healthData object
app.put("/patient/update-health/:_id", async (req, res) => {
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

app.get("/med-data", async (req, res) => {
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


// DELETE
// route: /patient/delete/:_id
// description: To delete a patient
// e-parameter:  
app.delete("/patient/delete/:_id", async (req, res) => {
    try{
        const { _id } = req.params;
        await patientModel.findByIdAndDelete(_id);
        return res.json({message: "Patient Deleted 🔪"});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
    
});






// GET
// route: /devtkn/create
// description: To create new device token - stored in DB and used by device to receive mqtt details
// q-parameter: user & pass
app.get("/devtkn/create", async (req, res) => {
    
    try{
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
                //JIT(Just-in-time) handler
                var date_ob = new Date();
                var moment_s = date_ob.getDate()+'-'+date_ob.getMonth()+'/'+date_ob.getHours()+':'+date_ob.getMinutes()+':'+date_ob.getSeconds();             
                let tkn = await crypto("sha256", moment_s).update(pass).digest("hex");
                
                const filter = { user: user };
                const update = { devtoken: tkn };
                let doc = await patientModel.findOneAndUpdate(filter, update, {
                new: true
                });
                return res.json ({device_token: tkn, time: moment_s});   
            }      
        }   
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }   
});





// GET
// route: /devtkn/portal
// description: (On Portal) To get MQTT-server URL, userName and device-token, used for third party MQTT service
// q-parameter: user & token
app.get("/devtkn/portal", async (req, res) => {
  
  
    try{
        const body = req.query;
        const user = body.user;
        const ch_token = body.token;
        const patient = await patientModel.find({user: user});
        
        if (!patient){
            return res.json ({message: "User not Found"});
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
              let mqttserver = process.env.MQTTSERVER;
              let mqttUser = process.env.MQTTUSER;
              let mqttPass = process.env.MQTTPASS;
              return res.json ({mqttserver: mqttserver, mqttUser: mqttUser, mqttPass: mqttPass});
            }
            else{
              return res.json ({message: "Token does not match. Try to Login Again."});
            }
        }    
    }
    catch(error){
        return res.status(500).json({error: error.message});
    } 
    
      
       
});



// GET
// route: /devtkn/device
// description: (On Device) To get MQTT-server URL, userName and password, used for third party MQTT service
// q-parameter: user & devtoken
app.get("/devtkn/device", async (req, res) => {

    try {
    
        const body = req.query;
        const dev_token = body.token;
        const user = body.user;
        const patient = await patientModel.find({user: user, devtoken: dev_token});
        const check = (patient == []);
      
        if (!check){    
            const valtoken = patient[0].devtoken;
            const valuser = patient[0].user;   
            
            if ((valtoken == dev_token) && (valuser == user)){
                let mqttserver = process.env.MQTTSERVER;
                let mqttUser = process.env.MQTTUSER;
                let mqttPass = process.env.MQTTPASS;
                return res.json ({mqttserver: mqttserver, mqttUser: mqttUser, mqttPass: mqttPass});            
            }          
        }     
    } 
    catch(error) {
        return res.status(500).json({error: error.message});
    }
       
});




// POST
// route: /node/create
// description: To create NEW node device, node-xxxxxxx to be stored and used for data-exchange
// q-parameter: user & dev_token
app.post("/node/create", async (req, res) => {
    try {
        const { token: dev_token, user } = req.query;
        const { nodeData } = req.body;
    
        if (!nodeData || !nodeData.devices || !nodeData.devices.node || !nodeData.devices.type || !nodeData.devices.attribute) {
        return res.status(400).json({ error: "Invalid nodeData. Please provide all required device fields." });
        }
    
        const patient = await patientModel.findOne({ user, devtoken: dev_token });
    
        if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
        }
    
        await patientModel.findOneAndUpdate(
        { user },
        { $push: { devices: nodeData.devices } },
        { new: true }
        );
    
        return res.json({ message: "Node Created 🎆" });
    
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    });


// GET
// route: /node/device
// description: To view node-xxxxxxx and attributes to be stored and used for data-exchange
// q-parameter: user, dev_token & node-xxxxxxxx
app.get("/node/device", async (req, res) => {
    try {
        const { token: dev_token, user, node } = req.query;
        const nodeId = `node-${node}`;

        // Validate input
        if (!dev_token || !user || !node) {
        return res.status(400).json({ error: "Missing required query parameters: token, user, or node" });
        }

        // Find the patient using token and user
        const patient = await patientModel.findOne({ user, devtoken: dev_token });

        if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
        }

        // Find the device using array filter
        const device = patient.devices.find((d) => d.node === nodeId);

        if (!device) {
        return res.status(404).json({ message: "Node not found" });
        }

        // Return node and attribute if found
        return res.json({ node: device.node, type: device.type, attribute: device.attribute, lastUp: device.lastUp, battery: device.battery });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
    });


// PUT
// route: /health/update
// description: Update health attributes (StepCount, Water, sleepHours, BPM)
// q-parameter: user, dev_token
// request body: healthData object
app.put("/health/update", async (req, res) => {
    try {
        const { user, token: dev_token } = req.query;
        const { healthData } = req.body;
    
        if (!healthData || Object.keys(healthData).length === 0) {
          return res.status(400).json({ error: "Invalid or empty health data" });
        }
    
        const patient = await patientModel.findOne({ user, devtoken: dev_token });
    
        if (!patient) {
          return res.status(404).json({ error: "Patient not found or token invalid" });
        }
    
        // Prepare the update payload
        const updatePayload = {};
        Object.keys(healthData).forEach((key) => {
          if (Array.isArray(healthData[key])) {
            healthData[key].forEach((item) => {
              if (!item.date || item.value === undefined) {
                throw new Error(`Invalid data for ${key}. Each entry must have 'date' and 'value'.`);
              }
              updatePayload[`healthData.${key}`] = updatePayload[`healthData.${key}`] || [];
              updatePayload[`healthData.${key}`].push(item);
            });
          }
        });
    
        // Update without device schema validation
        const updatedPatient = await patientModel.findOneAndUpdate(
          { user, devtoken: dev_token },
          { $set: updatePayload },
          { new: true }
        );
    
        return res.json({ message: "Health Updated 💙" });

      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    });




// DELETE
// route: /node/delete
// description: To delete a node device of a user
// q-parameter: user, dev_token, node-ID
app.delete("/node/delete", async (req, res) => {
    try{
        const quer = req.query;
        const dev_token = quer.token;
        const user = quer.user;
        const node = quer.node;

        const patient = await patientModel.find({user: user, devtoken: dev_token});
        const check = (patient == []);
      
        if (!check){    
            const valtoken = patient[0].devtoken;
            const valuser = patient[0].user;   
            
            if ((valtoken == dev_token) && (valuser == user)){
                
                const filter = { user: user };
                const updatepatient = await patientModel.findOneAndUpdate(
                    filter,
                    { $pull: { devices: { $gte: {node: node} } }}    
                );
                
                return res.json ({message: "Node Deleted 🔪"});            
            }          
        }
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
    
});




//Handle all other requests on the server unmatched with above requests
app.get('*', function(req, res) {
  res.status(404).sendFile(__dirname + '/404.html');
});

//Connecting server to database
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => connectDB()
    .then(() => console.log("Server is Running 🚀"))
    .catch((error) => console.log(error)) 
);
