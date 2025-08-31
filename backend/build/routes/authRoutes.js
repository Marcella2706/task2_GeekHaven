"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/google', authController_1.googleAuth);
router.post('/forgot-password', authController_1.forgotPassword);
router.post('/reset-password', authController_1.resetPassword);
router.post('/refresh', authMiddleware_1.protect, authController_1.refreshToken);
router.post('/logout', authMiddleware_1.protect, authController_1.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map