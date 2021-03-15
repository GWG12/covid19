import express from 'express';
// Controllers
import * as tokenController from '../controllers/token.js';


const router = express.Router();

// Routes
router.post('/refresh', tokenController.refresh);
router.post('/revoke', tokenController.revoke);


export default router;