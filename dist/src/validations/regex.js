"use strict";
// ==============================|| regex validation statement ||============================== //
Object.defineProperty(exports, "__esModule", { value: true });
exports.regex = void 0;
// ======|| password regex
const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
// ======|| email regex
const emailValidationRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
// ==============================|| export regex validation statement ||============================== //
exports.regex = { passwordValidationRegex, emailValidationRegex };
//# sourceMappingURL=regex.js.map