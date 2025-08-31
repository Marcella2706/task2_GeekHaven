import { Schema } from 'mongoose';
declare const _default: import("mongoose").Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    role: "buyer" | "seller";
    provider: "local" | "google";
    isVerified: boolean;
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
    addresses: import("mongoose").Types.DocumentArray<{
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }> & {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }>;
    isActive: boolean;
    phone?: string | null;
    avatar?: string | null;
    location?: string | null;
    googleId?: string | null;
    verificationToken?: string | null;
    lastLogin?: NativeDate | null;
    password?: string | null;
    sellerInfo?: {
        rating: number;
        totalReviews: number;
        totalSales: number;
        responseTime: string;
        badges: string[];
        businessName?: string | null;
        description?: string | null;
        policies?: {
            returns: string;
            shipping?: string | null;
            warranty?: string | null;
        } | null;
        bankDetails?: {
            accountNumber?: string | null;
            ifscCode?: string | null;
            accountHolderName?: string | null;
        } | null;
    } | null;
    preferences?: {
        notifications?: {
            push: boolean;
            email: boolean;
            sms: boolean;
        } | null;
        privacy?: {
            showProfile: boolean;
            showActivity: boolean;
        } | null;
    } | null;
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    role: "buyer" | "seller";
    provider: "local" | "google";
    isVerified: boolean;
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
    addresses: import("mongoose").Types.DocumentArray<{
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }> & {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }>;
    isActive: boolean;
    phone?: string | null;
    avatar?: string | null;
    location?: string | null;
    googleId?: string | null;
    verificationToken?: string | null;
    lastLogin?: NativeDate | null;
    password?: string | null;
    sellerInfo?: {
        rating: number;
        totalReviews: number;
        totalSales: number;
        responseTime: string;
        badges: string[];
        businessName?: string | null;
        description?: string | null;
        policies?: {
            returns: string;
            shipping?: string | null;
            warranty?: string | null;
        } | null;
        bankDetails?: {
            accountNumber?: string | null;
            ifscCode?: string | null;
            accountHolderName?: string | null;
        } | null;
    } | null;
    preferences?: {
        notifications?: {
            push: boolean;
            email: boolean;
            sms: boolean;
        } | null;
        privacy?: {
            showProfile: boolean;
            showActivity: boolean;
        } | null;
    } | null;
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    role: "buyer" | "seller";
    provider: "local" | "google";
    isVerified: boolean;
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
    addresses: import("mongoose").Types.DocumentArray<{
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }> & {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }>;
    isActive: boolean;
    phone?: string | null;
    avatar?: string | null;
    location?: string | null;
    googleId?: string | null;
    verificationToken?: string | null;
    lastLogin?: NativeDate | null;
    password?: string | null;
    sellerInfo?: {
        rating: number;
        totalReviews: number;
        totalSales: number;
        responseTime: string;
        badges: string[];
        businessName?: string | null;
        description?: string | null;
        policies?: {
            returns: string;
            shipping?: string | null;
            warranty?: string | null;
        } | null;
        bankDetails?: {
            accountNumber?: string | null;
            ifscCode?: string | null;
            accountHolderName?: string | null;
        } | null;
    } | null;
    preferences?: {
        notifications?: {
            push: boolean;
            email: boolean;
            sms: boolean;
        } | null;
        privacy?: {
            showProfile: boolean;
            showActivity: boolean;
        } | null;
    } | null;
} & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    role: "buyer" | "seller";
    provider: "local" | "google";
    isVerified: boolean;
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
    addresses: import("mongoose").Types.DocumentArray<{
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }> & {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }>;
    isActive: boolean;
    phone?: string | null;
    avatar?: string | null;
    location?: string | null;
    googleId?: string | null;
    verificationToken?: string | null;
    lastLogin?: NativeDate | null;
    password?: string | null;
    sellerInfo?: {
        rating: number;
        totalReviews: number;
        totalSales: number;
        responseTime: string;
        badges: string[];
        businessName?: string | null;
        description?: string | null;
        policies?: {
            returns: string;
            shipping?: string | null;
            warranty?: string | null;
        } | null;
        bankDetails?: {
            accountNumber?: string | null;
            ifscCode?: string | null;
            accountHolderName?: string | null;
        } | null;
    } | null;
    preferences?: {
        notifications?: {
            push: boolean;
            email: boolean;
            sms: boolean;
        } | null;
        privacy?: {
            showProfile: boolean;
            showActivity: boolean;
        } | null;
    } | null;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    role: "buyer" | "seller";
    provider: "local" | "google";
    isVerified: boolean;
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
    addresses: import("mongoose").Types.DocumentArray<{
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }> & {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }>;
    isActive: boolean;
    phone?: string | null;
    avatar?: string | null;
    location?: string | null;
    googleId?: string | null;
    verificationToken?: string | null;
    lastLogin?: NativeDate | null;
    password?: string | null;
    sellerInfo?: {
        rating: number;
        totalReviews: number;
        totalSales: number;
        responseTime: string;
        badges: string[];
        businessName?: string | null;
        description?: string | null;
        policies?: {
            returns: string;
            shipping?: string | null;
            warranty?: string | null;
        } | null;
        bankDetails?: {
            accountNumber?: string | null;
            ifscCode?: string | null;
            accountHolderName?: string | null;
        } | null;
    } | null;
    preferences?: {
        notifications?: {
            push: boolean;
            email: boolean;
            sms: boolean;
        } | null;
        privacy?: {
            showProfile: boolean;
            showActivity: boolean;
        } | null;
    } | null;
}>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    role: "buyer" | "seller";
    provider: "local" | "google";
    isVerified: boolean;
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        addedAt: NativeDate;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
    addresses: import("mongoose").Types.DocumentArray<{
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }> & {
        type: "home" | "office" | "other";
        isDefault: boolean;
        phone?: string | null;
        fullName?: string | null;
        address1?: string | null;
        address2?: string | null;
        city?: string | null;
        state?: string | null;
        pincode?: string | null;
    }>;
    isActive: boolean;
    phone?: string | null;
    avatar?: string | null;
    location?: string | null;
    googleId?: string | null;
    verificationToken?: string | null;
    lastLogin?: NativeDate | null;
    password?: string | null;
    sellerInfo?: {
        rating: number;
        totalReviews: number;
        totalSales: number;
        responseTime: string;
        badges: string[];
        businessName?: string | null;
        description?: string | null;
        policies?: {
            returns: string;
            shipping?: string | null;
            warranty?: string | null;
        } | null;
        bankDetails?: {
            accountNumber?: string | null;
            ifscCode?: string | null;
            accountHolderName?: string | null;
        } | null;
    } | null;
    preferences?: {
        notifications?: {
            push: boolean;
            email: boolean;
            sms: boolean;
        } | null;
        privacy?: {
            showProfile: boolean;
            showActivity: boolean;
        } | null;
    } | null;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=User.d.ts.map