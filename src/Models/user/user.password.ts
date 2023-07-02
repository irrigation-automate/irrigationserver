// ==============================|| package, variables and functions ||============================== //

// ======|| import mpngoose package for schema ( model )
import { Model, model,  Schema } from 'mongoose';
// ======|| import bcrypt package for hash password
import bcrypt from 'bcryptjs';
// ======|| import interface user password schema 
import { IUserPasswordchema } from '../../interface/interfaces/models';

// ==============================|| User model ||============================== //

// ======|| Create Schema for User password
const PasswordSchema = new Schema<IUserPasswordchema>({
  password: {
    type : String,
    required: true
  },
  last_update: {
    type: Date,
    default: Date.now(),
  }
});

// ======|| Create new methodes  for User password model
// -- hash password
PasswordSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

// ======|| Create new document for User password model

const Password: Model<IUserPasswordchema> = model<IUserPasswordchema>('Password', PasswordSchema);
export default  Password;