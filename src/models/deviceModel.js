const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
    node: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    attribute: {
      type: String,
      required: true
    },
    lastUp: {
      type: String,
      required: true
    },
    battery: {
      type: String,
      required: true
    }
  }, { _id: false });


module.exports = deviceSchema;