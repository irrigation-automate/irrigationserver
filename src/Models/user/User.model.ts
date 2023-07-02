// ==============================|| package, variables and functions ||============================== //

// ======|| import mpngoose package for schema ( model )
import { Model, model,  Schema } from 'mongoose';
// ======|| import jwt package for generation authorization
import jwt from 'jsonwebtoken';

// ======|| import envirement variables 
import { enirementVariables } from '../../configs/envirementVariables';
// ======|| import interface user schema 
import { IUserSchema } from '../../interface/interfaces/models';
// ======|| import models  
// --- import interface user adress schema 
import UserAddress from './User.adress';
// --- import interface user contact schema 
import UserContact from './user.contact';
// --- import interface user password schema 
import UserPassword from './user.password';

// === destraction JWT secret  variables 
const { JWTSecret } = enirementVariables.JWTConfig;

// ==============================|| User model ||============================== //

// ======|| Create Schema for Users 
const UserSchema = new Schema<IUserSchema>({
  address: {
    type: Schema.Types.ObjectId,
    ref: UserAddress.modelName,
    required: true,
    unique: true,
  },
  blocked: {
    type: Boolean,
    required: true,
    default: true,
  },
  contact: {
    type: Schema.Types.ObjectId,
    ref: UserContact.modelName,
    required: true,
  },
  creation_date: {
    type: Date,
    default: Date.now(),
  },
  password: {
    type: Schema.Types.ObjectId,
    ref: UserPassword.modelName,
    required: true,
  },
  weather: {
    type: Schema.Types.ObjectId,
    ref: 'Weather',
  },
  reglage: {
    type: Schema.Types.ObjectId,
    ref: 'Reglage',
  },
});

// ======|| Create new methodes  for User model

UserSchema.methods.generateAuthToken = function (): string | null {
  if(JWTSecret) {
    const token = jwt.sign({ _id: this._id }, JWTSecret, {
      expiresIn: '10h',
    });
    return token;
  }
  return null;
};

// ======|| Create new document for User model

const UserModel: Model<IUserSchema> = model<IUserSchema>('User', UserSchema);

export default  UserModel;