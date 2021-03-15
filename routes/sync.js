import express from 'express';
// Controllers
import * as syncController from '../controllers/sync.js';
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();

// Routes
router.get('', authMiddleware, syncController.sync);


export default router;