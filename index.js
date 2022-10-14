require("dotenv").config();

const express = require("express");

//mongoose connection
const connectDB = require("./connection");

// mongoose model
const patientModel = require("./patient");

//hashing
const secret = "HEALTH_CONNECT";
const crypto = require("crypto").createHmac;

//const sha256Hasher = crypto.

const app = express();


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// configuration
app.use(express.json());


// GET
// route: /
// description: To get all patient
// parameter: none 
app.get("/&*1@3", async (req, res) => {
    
    const patient = await patientModel.find();
    if (!patient){
            return res.json ({message: "Not Avalaible"});
        }
    return res.json({patient});

}); 

// GET
// route: /patient/:_id
// description: To get patient with 'id'
// parameter: _id 
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
// route: /patient/data
// description: To get patient data with 'id' and 'pass'
// parameter: _id & pass
app.get("/data", async (req, res) => {
    
    try{
        const body = req.query;
        const uid = body.uid;
        const auth = body.auth;
      
        const patient = await patientModel.find({_id: uid, pass: auth});
        if (!patient){
            return res.json ({message: "No Data Found"});
        }
        return res.json ({ patient });
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }    
});


// GET
// route: /patient/age/:age
// description: To get all patient with 'age'
// parameter: age 
app.get("/patient/age/:age", async (req, res) => {
    try {
        const { age } = req.params;
        const patient = await patientModel.find({Age: age});
        if (!patient){
            return res.json({message: "No patient found"});
        }   
        return res.json ({ patient });
    } 
    catch(error) {
        return res.status(500).json({error: error.message});
    }
    
});

// GET
// route: /patient/login/<params>
// description: To get all patient data with 'user' & 'pass'
// parameter: user & pass

app.get("/login", async (req, res) => {
    try {
        const body = req.query;
        const pass = body.pass;
        const user = body.user;

        //const patient_pass = await crypto("sha256", secret).update(pass).digest("hex");
        const patient_pass = crypto.createHmac('sha256', secret).update(pass).digest("hex");
      
        const patient = await patientModel.find({user: user, pass: patient_pass});
        
        //console.log(patient == []);
        const check = (patient == []);
        
      
        if (!check){    
            const valpass = patient[0].pass;
            const valuser = patient[0].user;   
            
            if ((valpass == patient_pass) && (valuser == user)){
                return res.json ({ patient });
            }
            else{
                //return res.json({message: "Incorrect Username or Password"});
              return res.status(500).json({error: error.message});
            }
        }   
        else{
            return res.status(500).json({error: error.message});
            //return res.json({message: "Incorrect Username or Password"});
        }    
        
        return res.json (patient);
        //return res.json ({ patient });
    } 
    catch(error) {
        
        return res.status(500).json({error: error.message});
    }
    
});


// POST
// route: /patient/signup
// description: To add new patient
// parameter: none 
// request body: patient object
app.post("/patient/signup", async(req, res) => {

    try{
        var { newpatient } = req.body;
        const pass = newpatient.pass;
        const user = newpatient.user;
        //console.log(pass);
        //const patient_pass = await crypto("sha256", secret).update(pass).digest("hex");
        const patient_pass = crypto.createHmac('sha256', secret).update(pass).digest("hex");
      
        await patientModel.create(newpatient);
        
        const filter = { user: user };
        const update = { pass: patient_pass };

        let doc = await patientModel.findOneAndUpdate(filter, update, {
        new: true
        });

        const { _id } = res.json;
        console.log(res.json);

        //console.log(updatepatient);
        //res.json({patient: updatepatient});
        return res.json({message: "Patient Created", _id: _id});
    } 
    catch(error){
        return res.status(500).json({error: error.message});
    }
    
});

// PUT
// route: /patient/update/:_id
// description: To update a patient
// parameter: _id 
// request body: patient object
app.put("/patient/update/:_id", async (req, res) => {

    try {
        const { _id } = req.params;
        const { patientData } = req.body;

        console.log(patientData);
        const updatepatient = await patientModel.findByIdAndUpdate(
            _id,
            { $set: patientData},
            { new: true}     
        );
        console.log(updatepatient);
        return res.json({patient: updatepatient});  
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
       
});


// DELETE
// route: /patient/delete/:_id
// description: To delete a patient
// parameter:  
// request body: none
app.delete("/patient/delete/:_id", async (req, res) => {
    try{
        const { _id } = req.params;
        await patientModel.findByIdAndDelete(_id);
        return res.json({message: "patient Deleted 🔪"});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
    
});


// route: /patient/delete/name/:name
// description: To delete a patient with name
// parameter: name
// request body: none
app.delete("/patient/delete/name/:name", async (req, res) => {
    try {
        const { name } = req.params;
    await patientModel.findOneAndDelete({ name });
    return res.json({message: "patient Deleted 🔪"})
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
    
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => connectDB()
    .then(() => console.log("Server is Running 🚀"))
    .catch((error) => console.log(error)) 
);
