import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ASSIGNMENT_SEED = process.env.ASSIGNMENT_SEED || 'GHW25-DEFAULT';

export const protect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(token, ASSIGNMENT_SEED);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

export const sellerOnly = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== 'seller') {
        return res.status(403).json({ message: 'Access denied, sellers only' });
    }
    next();
};