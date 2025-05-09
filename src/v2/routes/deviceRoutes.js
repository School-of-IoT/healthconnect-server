require("dotenv").config();
const express = require("express");
const adminkey = process.env.ADMINKEY;

const { createDevToken, create_DeviceNode, get_DeviceNode, 
        updateHealthData, delete_DeviceNode, getDevToken 
      } = require('../controllers/deviceControl');

const deviceRoutes = express.Router();

deviceRoutes.post("/devtkn", createDevToken);
deviceRoutes.get("/devtkn", getDevToken);

deviceRoutes.post("/node", create_DeviceNode);
deviceRoutes.get("/node", get_DeviceNode);
deviceRoutes.delete("/node", delete_DeviceNode);

deviceRoutes.put("/health", updateHealthData);

module.exports =  deviceRoutes;