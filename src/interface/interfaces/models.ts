import { Document, Schema } from 'mongoose';

export interface IUserSchema extends Document {
    _id: string;
    // Add other properties of the user schema
  
    address?: Schema.Types.ObjectId | string; // Add the address property
    blocked: boolean;
    contact: Schema.Types.ObjectId | string;
    creation_date: Date;
    password: Schema.Types.ObjectId | string;
    weather?: Schema.Types.ObjectId | string;
    reglage?: Schema.Types.ObjectId | string;
  
    generateAuthToken: () => string | null;
  }