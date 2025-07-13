import {Router} from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const authRoutes = Router();

// router for register user 
authRoutes.post('/register', registerUser);

authRoutes.post('/login', loginUser)
authRoutes.get("/logout", protect, logoutUser)

export default authRoutes