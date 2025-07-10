import {Router} from 'express';
import { registerUser } from '../controllers/userController.js';

const authRoutes = Router();

// router for register user 
authRoutes.post('/register', registerUser);

export default authRoutes