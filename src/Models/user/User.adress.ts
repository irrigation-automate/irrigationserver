import mongoose  from 'mongoose';
const { Schema, model } = mongoose;

const userAddressSchema = new Schema({
  city: {
    type: String,
  },
  country: {
    type: String,
    default :'Tunisia'
  },
  Street: {
    type: String,
  },
  codeZip : {
    type: Number,
  },
  last_update: {
    type: Date,
    default: Date.now(),
  },
});

const userAddress = model('UserAddress', userAddressSchema);
module.exports =  userAddress;