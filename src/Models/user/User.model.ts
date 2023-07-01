import mongoose  from 'mongoose';
const { Schema, model } = mongoose;

import jwt from 'jsonwebtoken';
import { enirementVariables } from '../../configs/envirementVariables';
const { JWTSecret } = enirementVariables.JWTConfig;

// ----- Create Schema for Users 
const userSchema = new Schema({
  address: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserAddress',
    require:true,
    unique: true
  },
  blocked : {
    type  : Boolean,
    required: true,
    default : true
  },
  contact:{
    type: Schema.Types.ObjectId,
    ref:'UserContact',
    required: true,
  },
  creation_date: {
    type: Date,
    default: Date.now(),
  },
  password: {
    type: Schema.Types.ObjectId,
    ref: 'Password',
    required: true
  },
  weather: {
    type: Schema.Types.ObjectId,
    ref: 'Wether'
  },
  reglage: {
    type: Schema.Types.ObjectId,
    ref: 'Reglage'
  }
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
userSchema.methods.generateAuthToken = function () {
  if(JWTSecret) {
    const token = jwt.sign({ _id: this._id }, JWTSecret, {
      expiresIn: '10h',
    });
    return token;
  }
  return null;
};


const User = model('User', userSchema);

module.exports =  User;