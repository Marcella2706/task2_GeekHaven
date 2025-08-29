import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import * as dotenv from 'dotenv';

dotenv.config();

const ASSIGNMENT_SEED = process.env.ASSIGNMENT_SEED || 'GHW25-DEFAULT';

export const hmacSign = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    res.json = (body) => {
        const signature = crypto.createHmac('sha256', ASSIGNMENT_SEED)
            .update(JSON.stringify(body))
            .digest('hex');
        res.setHeader('X-Signature', signature);
        return originalJson.call(res, body);
    };
    next();
};