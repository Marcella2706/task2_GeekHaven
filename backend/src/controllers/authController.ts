import * as dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import User from "../models/User";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

type TokenExpires = "7d" | "1d" | "12h" | "6h";

const ASSIGNMENT_SEED: Secret = (process.env.ASSIGNMENT_SEED as Secret) || "GHW25-DEFAULT";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const generateToken = (
    userId: string,
    role: string,
    expiresIn: TokenExpires = "7d"
  ): string => {
    const payload = { userId, role };
    const options: SignOptions = { expiresIn }; 
    return jwt.sign(payload, ASSIGNMENT_SEED, options);
  };

const createUserResponse = (user: any) => ({
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

export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, role, phone, location } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "fullName, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData: any = {
      fullName,
      email,
      password: hashedPassword,
      role: role || "buyer",
      provider: "local",
      isVerified: false,
    };

    if (phone) userData.phone = phone;
    if (location) userData.location = location;

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

    const user = new User(userData);
    await user.save();

    const token = generateToken(user._id.toString(), user.role);

    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: createUserResponse(user),
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email, provider: "local" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account has been deactivated" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in" });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
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

    let user = await User.findOne({
      $or: [{ googleId }, { email, provider: "google" }],
    });

    let createdNew = false;
    if (user) {
      user.lastLogin = new Date();
      await user.save();
    } else {
      const userData: any = {
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

      user = new User(userData);
      await user.save();
      createdNew = true;
    }

    const jwtToken = generateToken(user._id.toString(), user.role);

    res.json({
      message: createdNew ? "Account created and logged in" : "Login successful",
      token: jwtToken,
      user: createUserResponse(user),
    });
  } catch (err: any) {
    console.error("Google auth error:", err);
    res.status(500).json({ message: "Error with Google authentication" });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      return res.status(404).json({ message: "User not found or inactive" });
    }

    const token = generateToken(user._id.toString(), user.role);

    res.json({
      token,
      user: createUserResponse(user),
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Error refreshing token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Error logging out" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email, provider: "local" });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "Password reset instructions sent to your email",
      resetToken: "dev-reset-token-" + user._id,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Error processing forgot password" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "resetToken and newPassword are required" });
    }

    if (!resetToken.startsWith("dev-reset-token-")) {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const userId = resetToken.replace("dev-reset-token-", "");
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Error resetting password" });
  }
};
