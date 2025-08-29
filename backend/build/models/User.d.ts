import { Schema } from 'mongoose';
declare const _default: import("mongoose").Model<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    password: string;
    role: "buyer" | "seller";
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
}, {}, {}, {}, import("mongoose").Document<unknown, {}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    password: string;
    role: "buyer" | "seller";
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
}, {}, {
    timestamps: true;
}> & {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    password: string;
    role: "buyer" | "seller";
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
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
    password: string;
    role: "buyer" | "seller";
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    password: string;
    role: "buyer" | "seller";
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
}>, {}, import("mongoose").ResolveSchemaOptions<{
    timestamps: true;
}>> & import("mongoose").FlatRecord<{
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    fullName: string;
    email: string;
    password: string;
    role: "buyer" | "seller";
    cart: import("mongoose").Types.DocumentArray<{
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }, import("mongoose").Types.Subdocument<import("bson").ObjectId, any, {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }> & {
        quantity: number;
        product?: import("mongoose").Types.ObjectId | null;
    }>;
    wishlist: import("mongoose").Types.ObjectId[];
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>>;
export default _default;
//# sourceMappingURL=User.d.ts.map