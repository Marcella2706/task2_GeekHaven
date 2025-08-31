"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: String,
    role: { type: String, enum: ['buyer', 'seller'], default: 'buyer' },
    avatar: String,
    location: String,
    googleId: String,
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    cart: [{
            product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 },
            addedAt: { type: Date, default: Date.now }
        }],
    wishlist: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Product'
        }],
    sellerInfo: {
        businessName: String,
        description: String,
        rating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
        totalSales: { type: Number, default: 0 },
        responseTime: { type: String, default: '< 2 hours' },
        policies: {
            returns: { type: String, default: '7-day return policy' },
            shipping: String,
            warranty: String
        },
        badges: [String],
        bankDetails: {
            accountNumber: String,
            ifscCode: String,
            accountHolderName: String
        }
    },
    preferences: {
        notifications: {
            email: { type: Boolean, default: true },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true }
        },
        privacy: {
            showProfile: { type: Boolean, default: true },
            showActivity: { type: Boolean, default: false }
        }
    },
    addresses: [{
            type: { type: String, enum: ['home', 'office', 'other'], default: 'home' },
            fullName: String,
            phone: String,
            address1: String,
            address2: String,
            city: String,
            state: String,
            pincode: String,
            isDefault: { type: Boolean, default: false }
        }],
    lastLogin: Date,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ 'sellerInfo.rating': -1 });
userSchema.virtual('sellerStats').get(function () {
    if (this.role !== 'seller')
        return null;
    return {
        rating: this.sellerInfo?.rating ?? 0,
        totalReviews: this.sellerInfo?.totalReviews ?? 0,
        totalSales: this.sellerInfo?.totalSales ?? 0,
        responseTime: this.sellerInfo?.responseTime ?? '< 2 hours'
    };
});
exports.default = (0, mongoose_1.model)('User', userSchema);
//# sourceMappingURL=User.js.map