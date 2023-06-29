"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema, model } = mongoose_1.default;
const userAddressSchema = new Schema({
    city: {
        type: String,
    },
    country: {
        type: String,
        default: 'Tunisia'
    },
    Street: {
        type: String,
    },
    codeZip: {
        type: Number,
    },
    last_update: {
        type: Date,
        default: Date.now(),
    },
});
const userAddress = model('UserAddress', userAddressSchema);
module.exports = userAddress;
