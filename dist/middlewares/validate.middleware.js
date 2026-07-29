"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = validateBody;
const zod_1 = require("zod");
function validateBody(schema) {
    return (req, res, next) => {
        try {
            req.body = schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    message: "validation errors",
                    error: error.flatten().fieldErrors
                });
            }
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map