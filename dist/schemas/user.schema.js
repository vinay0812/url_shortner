"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.userSchema = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.email(),
    password: zod_1.default.string().min(6, 'password should be minimum 6 character long')
});
// export type loginUserInput = z.infer<typeof loginUserSchema>
//# sourceMappingURL=user.schema.js.map