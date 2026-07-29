"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUrlSchema = exports.createUrlSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUrlSchema = zod_1.default.object({
    originalUrl: zod_1.default.string().url('enter a valid url'),
    customShortCode: zod_1.default.string()
        .min(4, 'Minimum 4 characters')
        .max(10, 'Maximum 10 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Only alphanumeric, underscore, and hyphen allowed')
        .optional(),
    expiresIn: zod_1.default.string().regex(/^\d+[wdhms]$/, 'use format like 2w, 7d, 30d, 1h, 15m').optional()
    // userID:uuid
});
exports.updateUrlSchema = exports.createUrlSchema.partial();
//# sourceMappingURL=short.schema.js.map