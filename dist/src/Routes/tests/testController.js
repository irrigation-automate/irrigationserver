"use strict";
// ==============================|| based test server running route ||============================== //
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestData = void 0;
// ======|| get test route from server running
const getTestData = (_req, res) => {
    return res.status(200).send('Express + TypeScript Serving');
};
exports.getTestData = getTestData;
//# sourceMappingURL=testController.js.map