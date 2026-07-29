"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = getUser;
exports.getShortCode = getShortCode;
function getUser(req) {
    const user = req.user;
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}
function getShortCode(req) {
    const shortcode = req.params.shortcode;
    if (typeof shortcode === 'string')
        return shortcode;
    return shortcode?.[0] || '';
}
//# sourceMappingURL=request.js.map