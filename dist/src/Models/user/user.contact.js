"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const regex_1 = require("../../validations/regex");
const userContactSchema = new Schema({
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
const userContact = model('UserContact', userContactSchema);
module.exports = userContact;
