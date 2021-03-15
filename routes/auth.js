import express from 'express';
// Controllers
import * as authController from '../controllers/auth.js';


const router = express.Router();

// Routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);


export default router;