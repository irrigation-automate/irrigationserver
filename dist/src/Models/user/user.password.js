"use strict";
// ==============================|| package, variables and functions ||============================== //
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ======|| import mpngoose package for schema ( model )
const mongoose_1 = require("mongoose");
// ======|| import bcrypt package for hash password
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// ==============================|| User model ||============================== //
// ======|| Create Schema for User password
const PasswordSchema = new mongoose_1.Schema({
    password: {
        type: String,
        required: true
    },
    last_update: {
        type: Date,
        default: Date.now(),
    }
});
// ======|| Create new methodes  for User password model
// -- hash password
PasswordSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.isModified('password')) {
            return next();
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hash = yield bcryptjs_1.default.hash(this.password, salt);
        this.password = hash;
        next();
    });
});
// ======|| Create new document for User password model
const Password = mongoose_1.model('Password', PasswordSchema);
exports.default = Password;
