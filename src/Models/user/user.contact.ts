import mongoose  from 'mongoose';
const {Schema, model} = mongoose;

import {regex} from '../../validations/regex';

const userContactSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function(v: string) : boolean {
        return regex.emailValidationRegex.test(v);
      },
      message: '{VALUE} is not a valid email!'
    },
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  last_update: {
    type: Date,
    default: Date.now(),
  },
});

const userContact = model('UserContact', userContactSchema);
module.exports =  userContact;