import { Document, Schema } from 'mongoose';

export interface IUserContactSchema extends Document {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    last_update: Date;
}

export interface IUserAdressSchema extends Document {
    _id: string;
    city: string ;
    Street: string;
    country: string;
    codeZip: number;
    last_update: Date;
}


export interface IUserSchema extends Document {
  _id: string;
  address?: Schema.Types.ObjectId | string;
  blocked: boolean;
  contact: IUserContactSchema;
  creation_date: Date;
  password: Schema.Types.ObjectId | string;
  weather?: Schema.Types.ObjectId | string;
  reglage?: Schema.Types.ObjectId | string;
  
  generateAuthToken: () => string | null;
}
