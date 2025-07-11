import {Router} from 'express';
import { loginUser, registerUser } from '../controllers/userController.js';

const authRoutes = Router();

// router for register user 
authRoutes.post('/register', registerUser);

authRoutes.post('/login', loginUser)

export default authRoutes