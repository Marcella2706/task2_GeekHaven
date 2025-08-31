"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.refreshToken = exports.googleAuth = exports.login = exports.register = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const google_auth_library_1 = require("google-auth-library");
const ASSIGNMENT_SEED = process.env.ASSIGNMENT_SEED || "GHW25-DEFAULT";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const googleClient = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID);
const generateToken = (userId, role, expiresIn = "7d") => {
    const payload = { userId, role };
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, ASSIGNMENT_SEED, options);
};
const createUserResponse = (user) => ({
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    location: user.location,
    isVerified: user.isVerified,
    phone: user.phone,
    preferences: user.preferences,
    sellerInfo: user.role === "seller" ? user.sellerInfo : undefined,
});
const register = async (req, res) => {
    try {
        const { fullName, email, password, role, phone, location } = req.body;
        if (!email || !password || !fullName) {
            return res.status(400).json({ message: "fullName, email and password are required" });
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }
        if (typeof password !== "string" || password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const userData = {
            fullName,
            email,
            password: hashedPassword,
            role: role || "buyer",
            provider: "local",
            isVerified: false,
        };
        if (phone)
            userData.phone = phone;
        if (location)
            userData.location = location;
        if (role === "seller") {
            userData.sellerInfo = {
                businessName: fullName,
                description: "",
                rating: 0,
                totalReviews: 0,
                totalSales: 0,
                responseTime: "< 2 hours",
                policies: {
                    returns: "7-day return policy",
                    shipping: "Free shipping on orders above ₹2000",
                    warranty: "6 months warranty",
                },
                badges: ["New Seller"],
            };
        }
        const user = new User_1.default(userData);
        await user.save();
        const token = generateToken(user._id.toString(), user.role);
        user.lastLogin = new Date();
        await user.save();
        res.status(201).json({
            message: "User registered successfully",
            token,
            user: createUserResponse(user),
        });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Error registering user" });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User_1.default.findOne({ email, provider: "local" });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: "Account has been deactivated" });
        }
        if (!user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user._id.toString(), user.role);
        user.lastLogin = new Date();
        await user.save();
        res.json({
            message: "Login successful",
            token,
            user: createUserResponse(user),
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Error logging in" });
    }
};
exports.login = login;
const googleAuth = async (req, res) => {
    try {
        const { token, role = "buyer" } = req.body;
        if (!GOOGLE_CLIENT_ID) {
            return res.status(500).json({ message: "Google authentication not configured" });
        }
        if (!token) {
            return res.status(400).json({ message: "Google ID token is required" });
        }
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ message: "Invalid Google token" });
        }
        const googleId = payload.sub;
        const email = payload.email || "";
        const name = payload.name || "";
        const picture = payload.picture || "";
        let user = await User_1.default.findOne({
            $or: [{ googleId }, { email, provider: "google" }],
        });
        let createdNew = false;
        if (user) {
            user.lastLogin = new Date();
            await user.save();
        }
        else {
            const userData = {
                fullName: name,
                email,
                googleId,
                provider: "google",
                role,
                isVerified: true,
                avatar: picture,
            };
            if (role === "seller") {
                userData.sellerInfo = {
                    businessName: name,
                    description: "",
                    rating: 0,
                    totalReviews: 0,
                    totalSales: 0,
                    responseTime: "< 2 hours",
                    policies: {
                        returns: "7-day return policy",
                        shipping: "Free shipping on orders above ₹2000",
                        warranty: "6 months warranty",
                    },
                    badges: ["New Seller"],
                };
            }
            user = new User_1.default(userData);
            await user.save();
            createdNew = true;
        }
        const jwtToken = generateToken(user._id.toString(), user.role);
        res.json({
            message: createdNew ? "Account created and logged in" : "Login successful",
            token: jwtToken,
            user: createUserResponse(user),
        });
    }
    catch (err) {
        console.error("Google auth error:", err);
        res.status(500).json({ message: "Error with Google authentication" });
    }
};
exports.googleAuth = googleAuth;
const refreshToken = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await User_1.default.findById(userId);
        if (!user || !user.isActive) {
            return res.status(404).json({ message: "User not found or inactive" });
        }
        const token = generateToken(user._id.toString(), user.role);
        res.json({
            token,
            user: createUserResponse(user),
        });
    }
    catch (err) {
        console.error("Refresh token error:", err);
        res.status(500).json({ message: "Error refreshing token" });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        res.json({ message: "Logged out successfully" });
    }
    catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ message: "Error logging out" });
    }
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email)
            return res.status(400).json({ message: "Email is required" });
        const user = await User_1.default.findOne({ email, provider: "local" });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            message: "Password reset instructions sent to your email",
            resetToken: "dev-reset-token-" + user._id,
        });
    }
    catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ message: "Error processing forgot password" });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: "resetToken and newPassword are required" });
        }
        if (!resetToken.startsWith("dev-reset-token-")) {
            return res.status(400).json({ message: "Invalid reset token" });
        }
        const userId = resetToken.replace("dev-reset-token-", "");
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (typeof newPassword !== "string" || newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();
        res.json({ message: "Password reset successfully" });
    }
    catch (err) {
        console.error("Reset password error:", err);
        res.status(500).json({ message: "Error resetting password" });
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map