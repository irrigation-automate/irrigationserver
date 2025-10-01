"use strict";
// ==============================|| package mongoose imports ||============================== //
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// ==============================|| User adress model ||============================== //
// ======|| Create Schema for User adress
const UserAddressSchema = new mongoose_1.Schema({
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
// ======|| Create new document for User adress model
const UserAddress = (0, mongoose_1.model)('UserAddress', UserAddressSchema);
exports.default = UserAddress;
//# sourceMappingURL=User.adress.js.map