const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const brokerSchema = new mongoose.Schema({ username:String, password:String },{ timestamps:true });
brokerSchema.pre('save', async function(next){ if(this.isModified('password')) this.password=await bcrypt.hash(this.password,12); next(); });
module.exports = mongoose.model('Broker', brokerSchema);
