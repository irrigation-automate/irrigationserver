"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envirementVariables_1 = require("../../configs/envirementVariables");
const { JWTSecret } = envirementVariables_1.enirementVariables.JWTConfig;
// ----- Create Schema for Users 
const userSchema = new Schema({
    address: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'UserAddress',
    },
    blocked: {
        type: Boolean,
        required: true,
        default: true
    },
    contact: {
        type: Schema.Types.ObjectId,
        ref: 'UserContact',
        required: true,
    },
    creation_date: {
        type: Date,
        default: Date.now(),
    },
    password: {
        type: Schema.Types.ObjectId,
        ref: 'Password',
        required: true,
        unique: true
    },
    weather: {
        type: Schema.Types.ObjectId,
        ref: 'Wether',
        required: true,
        unique: true
    },
    reglage: {
        type: Schema.Types.ObjectId,
        ref: 'Reglage',
        required: true,
        unique: true
    }
});
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
userSchema.methods.generateAuthToken = function () {
    if (JWTSecret) {
        const token = jsonwebtoken_1.default.sign({ _id: this._id }, JWTSecret, {
            expiresIn: '10h',
        });
        return token;
    }
    return null;
};
const User = model('User', userSchema);
module.exports = User;
