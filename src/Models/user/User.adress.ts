// ==============================|| package mongoose imports ||============================== //

import { Model, Schema, model }  from 'mongoose';
import { IUserAdressSchema } from '../../interface/interfaces/models';

// ==============================|| User adress model ||============================== //
// ======|| Create Schema for User adress

const UserAddressSchema = new Schema<IUserAdressSchema>({
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

// ======|| Create new document for User adress model

const userAddress : Model<IUserAdressSchema> = model<IUserAdressSchema>('UserAddress', UserAddressSchema);

export default  userAddress;