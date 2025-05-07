require("dotenv").config();
const express = require("express");
const adminkey = process.env.ADMINKEY;

const { createDevToken, getMQTTConfig_Portal, getMQTTConfig_DevToken, 
          create_DeviceNode, get_DeviceNode, updateHealthData, 
          delete_DeviceNode } = require('../controllers/deviceControl');

const deviceRoutes = express.Router();

deviceRoutes.get("/devtkn/create", createDevToken);

deviceRoutes.get("/devtkn/portal", getMQTTConfig_Portal);
deviceRoutes.get("/devtkn/device", getMQTTConfig_DevToken);

deviceRoutes.get("/node/create", create_DeviceNode);
deviceRoutes.get("/node/device", get_DeviceNode);
deviceRoutes.get("/health/update", updateHealthData);
deviceRoutes.get("/node/delete", delete_DeviceNode);

module.exports =  deviceRoutes;