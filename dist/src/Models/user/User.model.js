"use strict";
// ==============================|| package, variables and functions ||============================== //
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ======|| import mpngoose package for schema ( model )
const mongoose_1 = require("mongoose");
// ======|| import jwt package for generation authorization
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ======|| import envirement variables 
const envirementVariables_1 = require("../../configs/envirementVariables");
// ======|| import models  
// --- import interface user adress schema 
const User_adress_1 = __importDefault(require("./User.adress"));
// --- import interface user contact schema 
const user_contact_1 = __importDefault(require("./user.contact"));
// --- import interface user password schema 
const user_password_1 = __importDefault(require("./user.password"));
// === destraction JWT secret  variables 
const { JWTSecret } = envirementVariables_1.enirementVariables.JWTConfig;
// ==============================|| User model ||============================== //
// ======|| Create Schema for Users 
const UserSchema = new mongoose_1.Schema({
    address: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: User_adress_1.default.modelName,
        required: true,
        unique: true,
    },
    blocked: {
        type: Boolean,
        required: true,
        default: true,
    },
    contact: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_contact_1.default.modelName,
        required: true,
    },
    creation_date: {
        type: Date,
        default: Date.now(),
    },
    password: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_password_1.default.modelName,
        required: true,
    },
    weather: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Weather',
    },
    reglage: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Reglage',
    },
});
// ======|| Create new methodes  for User model
UserSchema.methods.generateAuthToken = function () {
    if (JWTSecret) {
        const token = jsonwebtoken_1.default.sign({ _id: this._id }, JWTSecret, {
            expiresIn: '10h',
        });
        return token;
    }
    return null;
};
// ======|| Create new document for User model
const UserModel = mongoose_1.model('User', UserSchema);
exports.default = UserModel;
