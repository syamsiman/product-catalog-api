import {Router} from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { 
    registerUserValidation,
    loginUserValidation,
    validate
 } from '../middleware/validationMiddleware.js'

const authRoutes = Router();

// router for register user 
authRoutes.post('/register',registerUserValidation, validate, registerUser);

authRoutes.post('/login', loginUserValidation, validate, loginUser)
authRoutes.get("/logout", protect, logoutUser)

export default authRoutes