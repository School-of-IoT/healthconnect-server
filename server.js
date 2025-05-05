require('dotenv').config()
const patientRoutes = require('./src/routes/patientRoutes');
// const v1Route = require('./index');

const express = require("express");
const connectDB = require("./connection");

const app = express();
app.use(express.json());

//Important Headers for public uses
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});


app.get("/", async (req, res) => {
    return res.send('Server Active');
}); 

app.use('/api/v2/patient', patientRoutes);
// app.use('/api/v1/patient', v1Route);

// Handle all other requests on the server unmatched with below requests
app.get('*', function(req, res) {
  res.status(404).sendFile(__dirname + '/404.html');
});

//Connecting server to database
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => connectDB()
    .then(() => console.log("Server is Running 🚀"))
    .catch((error) => console.log(error)) 
);
