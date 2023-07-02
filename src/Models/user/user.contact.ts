// ==============================|| package, variables and functions ||============================== //

// ======|| import mpngoose package for schema ( model )
import { Model, Schema, model }  from 'mongoose';

// ======|| import validation function 
import { regex } from '../../validations/regex';

// ======|| import schema type 
import { IUserContactSchema } from '../../interface/interfaces/models';

// ==============================|| User contact model ||============================== //

// ======|| Create Schema for User contact
const UserContactSchema = new Schema<IUserContactSchema>({
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

// ======|| Create new document for User contact model
const UserContact: Model<IUserContactSchema> = model<IUserContactSchema>('UserContact', UserContactSchema);

export default UserContact;