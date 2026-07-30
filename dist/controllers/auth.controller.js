"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = register;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT = process.env.JWT_KEY;
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const exist = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if (exist) {
            return res.status(409).json({ message: "user exists" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        return res.status(200).json({ user });
    }
    catch (error) {
        return res.status(500).json("internal server error");
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (!user) {
            return res.status(400).json({ "message": "user does not exist" });
        }
        const result = await bcrypt_1.default.compare(password, user.password);
        if (!result) {
            return res.status(400).json({ "message": "wrong password" });
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
            name: user.name,
        }, JWT);
        return res.status(200).json(token);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
//# sourceMappingURL=auth.controller.js.map