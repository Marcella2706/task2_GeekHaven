import { Router } from 'express';
import { 
    register, 
    login, 
    googleAuth, 
    refreshToken, 
    logout, 
    forgotPassword, 
    resetPassword 
} from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.post('/refresh', protect, refreshToken);
router.post('/logout', protect, logout);

export default router;