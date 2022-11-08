//Connections

require("dotenv").config();
const express = require("express");
const connectDB = require("./connection");
const patientModel = require("./patient");



//secret handling
const secret = process.env.CRYPTO_SECRET;

const adminkey = process.env.ADMINKEY;


const crypto = require("crypto").createHmac;

const app = express();

//Important Headers for public uses
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
// route: /portal/device
// description: To get MQTT-server URL, userName and device-token, used for third party MQTT service
// q-parameter: user & token
app.get("/portal/device", async (req, res) => {
  
  
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
// route: /devtkn/device
// description: To get MQTT-server URL, userName and password, used for third party MQTT service
// q-parameter: user & pass
app.get("/devtkn/mqtt", async (req, res) => {

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


// GET
// route: /node/create
// description: To create node device, node-xxxxxxx to be stored and used for data-exchange
// q-parameter: user & dev_token
// body: node-> String, type-> String, attribute-> String, lastUp-> String
app.get("/node/create", async (req, res) => {

    try {
    
        const quer = req.query;
        const dev_token = quer.token;
        const user = quer.user;
        const { nodeData } = req.body;
        
        const patient = await patientModel.find({user: user, devtoken: dev_token});
        const check = (patient == []);
      
        if (!check){    
            const valtoken = patient[0].devtoken;
            const valuser = patient[0].user;   
            
            if ((valtoken == dev_token) && (valuser == user)){
                
                
                const updatepatient = await patientModel.findOneAndUpdate(
                    user,
                    { $set: nodeData},
                    { new: true}     
                );

                return res.json ({message: "Node Created 🎆"});            
            }          
        }     
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
            return res.json ({message: "No Data Found"});
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
              return res.json ({message: "Token does not match. Try to Login Again."});
            }
        }    
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


// POST
// route: /patient/signup
// description: To add new patient
// request body: patient object
app.post("/patient/signup", async(req, res) => {

    try{
        var { newpatient } = req.body;
        const pass = newpatient.pass;
        const user = newpatient.user;
        const username_check = await patientModel.find({user: user});
        
        if (!(username_check[0]===undefined)){
          return res.status(500).json({error: "Username exists"});
        }
      
        const patient_pass = await crypto("sha256", secret).update(pass).digest("hex");
        await patientModel.create(newpatient);
        const filter = { user: user };
        const update = { pass: patient_pass };

        let doc = await patientModel.findOneAndUpdate(filter, update, {
        new: true
        });

        const { _id } = res.json;
        return res.json({message: "Patient Created", uid: _id});
    } 
    catch(error){
        return res.status(500).json({error: error.message});
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
        return res.json({patient: updatepatient});  
    }
    catch(error){
        return res.status(500).json({error: error.message});
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

//Handle all other requests on the server unmatched with above requests
app.get('*', function(req, res){
    res.sendFile(__dirname+'/404.html');
    });

//Connecting server to database
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => connectDB()
    .then(() => console.log("Server is Running 🚀"))
    .catch((error) => console.log(error)) 
);
