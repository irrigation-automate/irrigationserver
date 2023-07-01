import bcrypt from 'bcryptjs';

import mongoose  from 'mongoose';
const { Schema, model } = mongoose;

const passwordSchema = new Schema({
  password: {
    type : String,
    required: true
  },
  last_update: {
    type: Date,
    default: Date.now(),
  }
});

passwordSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const password = this;
  if (!password.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password.password, salt);
  password.password = hash;
  next();
});

const password = model('Password', passwordSchema);
module.exports =  password;