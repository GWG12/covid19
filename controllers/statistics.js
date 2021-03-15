// Models
import { Statistics } from '../models/statistics.js';
// MongoDB
import mongoDb from 'mongodb';


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

export const getCountry = async (req, res, next) => {
    if (!mongoDb.ObjectId.isValid(req.params.countryId)) {
        const error = new Error("Invalid user");
        error.statusCode = 401;
        return next(error);
    }
    const countryId = new mongoDb.ObjectId(req.params.countryId);
    try {
        const data = await Statistics.getCountry(countryId);
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
