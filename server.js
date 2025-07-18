require('dotenv').config()


const v1Route = require('./src/v1/routes/patientRoutes');
const v1_Devices = require('./src/v1/routes/deviceRoutes');

const v2Route = require('./src/v2/routes/patientRoutes');
const v2_Devices = require('./src/v2/routes/deviceRoutes');


const express = require("express");
const connectDB = require("./connection");
const rateLimit = require('express-rate-limit');

// Rate limiting middleware to prevent abuse
// This will limit each IP to 100 requests per 15 minutes
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
app.use(express.json());

//Important Headers for public uses
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});



// app.get("/", async (req, res) => {
//     return res.send('Server Active');
// }); 

app.use('/api/', apiLimiter);
app.use('/node/', apiLimiter);

app.use('/api/v1', v1Route);
app.use('/api/v2', v2Route);

app.use('/node/v1', v1_Devices);
app.use('/node/v2', v2_Devices);


// Handle all other requests on the server unmatched with below requests
// app.get('*', function(req, res) {
//   res.status(404).sendFile(__dirname + '/404.html');
// });

//Connecting server to database
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => connectDB()
    .then(() => console.log("Server is Running 🚀"))
    .catch((error) => console.log(error)) 
);
