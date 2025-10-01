"use strict";
// ==============================|| package, variables and functions ||============================== //
Object.defineProperty(exports, "__esModule", { value: true });
// ======|| import mpngoose package for schema ( model )
const mongoose_1 = require("mongoose");
// ======|| import validation function 
const regex_1 = require("../../validations/regex");
// ==============================|| User contact model ||============================== //
// ======|| Create Schema for User contact
const UserContactSchema = new mongoose_1.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function (v) {
                return regex_1.regex.emailValidationRegex.test(v);
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
const UserContact = (0, mongoose_1.model)('UserContact', UserContactSchema);
exports.default = UserContact;
//# sourceMappingURL=user.contact.js.map