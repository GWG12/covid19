import express from 'express';
// Controllers
import * as statisticsController from '../controllers/statistics.js';
import { authMiddleware } from '../middleware/auth.js';


const router = express.Router();

// Routes
router.get('', authMiddleware, statisticsController.getAllCountries);
router.get('/continents', authMiddleware, statisticsController.getContinents);
router.get('/countries', authMiddleware, statisticsController.getAllCountriesList);
router.get('/:countryId', authMiddleware, statisticsController.getCountry);
router.post('/:countryId', authMiddleware, statisticsController.updateCountry);


export default router;