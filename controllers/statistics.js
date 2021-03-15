// Utils
import { genRefreshToken } from '../util/auth.js';
// Models
import { Statistics } from '../models/statistics.js';


export const getAllCountries = async (req, res, next) => {
    try {
        const data = await Statistics.getAllCountries();
        if (!data) {
            const error = new Error('Could not fetch data, please try again');
            error.statusCode = 500;
            return next(err);
        }
        return res.status(200).json(data);
    } catch (err) {
        err.message = 'Server error'
        err.statusCode = 500;
        return next(err);
    }
}

