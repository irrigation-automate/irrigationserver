"use strict";
// ==============================|| package, variables and functions ||============================== //
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
PasswordSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const hash = await bcryptjs_1.default.hash(this.password, salt);
    this.password = hash;
    next();
});
// ======|| Create new document for User password model
const Password = (0, mongoose_1.model)('Password', PasswordSchema);
exports.default = Password;
//# sourceMappingURL=user.password.js.map