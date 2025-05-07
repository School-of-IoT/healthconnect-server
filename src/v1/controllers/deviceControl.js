require("dotenv").config();

const patientModel = require("../../models/patientModel");
const secret = process.env.CRYPTO_SECRET;
const crypto = require("crypto").createHmac;



// GET
// route: /devtkn/create
// description: To create new device token - stored in DB and used by device to receive mqtt details
// q-parameter: user & pass
const createDevToken = async (req, res) => {
    
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
};



// GET
// route: /devtkn/portal
// description: (On Portal) To get MQTT-server URL, MQTT-user and MQTT-Pass, used for third party MQTT service
// q-parameter: user & token
const getMQTTConfig_Portal = async (req, res) => {  
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
};



// GET
// route: /devtkn/device
// description: (On Device) To get MQTT-server URL, userName and password, used for third party MQTT service
// q-parameter: user & devtoken
const getMQTTConfig_DevToken = async (req, res) => {
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
};


// POST
// route: /node/create
// description: To create NEW node device, node-xxxxxxx to be stored and used for data-exchange
// q-parameter: user & dev_token
const create_DeviceNode = async (req, res) => {
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
};


// GET
// route: /node/device
// description: To view node-xxxxxxx and attributes to be stored and used for data-exchange
// q-parameter: user, dev_token & node-xxxxxxxx
const get_DeviceNode = async (req, res) => {
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
};


// PUT
// route: /health/update
// description: Update health attributes (StepCount, Water, sleepHours, BPM)
// q-parameter: user, dev_token
// request body: healthData object
const updateHealthData = async (req, res) => {
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
};




// DELETE
// route: /node/delete
// description: To delete a node device of a user
// q-parameter: user, dev_token, node-ID
const delete_DeviceNode = async (req, res) => {
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
};



module.exports = {  createDevToken, getMQTTConfig_Portal, getMQTTConfig_DevToken, 
                    create_DeviceNode, get_DeviceNode, updateHealthData, delete_DeviceNode }