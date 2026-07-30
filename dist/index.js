"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shortener_routes_1 = __importDefault(require("./routes/shortener.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
require("./config/redis");
const app = (0, express_1.default)();
app.set("trust proxy", true);
const port = process.env.PORT || 3000;
// for rate limmiting
const rateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60000,
    limit: 5,
    message: 'Too Many requests, try again after some time'
});
// app.use(rateLimiter);
app.use(express_1.default.json());
app.get('/health', (req, res) => {
    return res.status(200).json("ok");
});
app.use('/auth', rateLimiter, auth_routes_1.default);
app.use('/shorten', shortener_routes_1.default);
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
});
//# sourceMappingURL=index.js.map