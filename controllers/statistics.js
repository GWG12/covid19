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

export const getAllCountriesList = async (req, res, next) => {
    try {
        const data = await Statistics.getAllCountriesList();
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

export const getContinents = async (req, res, next) => {
    try {
        const data = await Statistics.getStatsByContinent();
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

export const updateCountry = async (req, res, next) => {
    if (!mongoDb.ObjectId.isValid(req.params.countryId)) {
        const error = new Error("Invalid country");
        error.statusCode = 401;
        return next(error);
    }
    //const countryId = new mongoDb.ObjectId(req.params.countryId);
    const payload = req.body;
    const payloadKeys = Object.keys(payload);
    if (payloadKeys === 0) {
        const error = new Error('Malformed input');
        error.statusCode = 400;
        return next(err);
    };
    const countryId = new mongoDb.ObjectId(req.params.countryId);
    const queryObject = { _id: countryId };
    const updateObject = payloadKeys.reduce((accum, curr) => {
        let val = payload[curr]
        for (const nestedKey in val) {
            if (!Number.isInteger(val[nestedKey])) {
                const error = new Error('Input must be an integer');
                error.statusCode = 400;
                return next(error);
            }
            accum[`${curr}.${nestedKey}`] = {
                $sum: [`$${curr}.${nestedKey}`, val[nestedKey]]
            }
        }
        return accum;
    }, {});
    try {
        const data = await Statistics.postCountry(queryObject, updateObject);
        if (!data) {
            const error = new Error("Country not found")
            error.statusCode = 404;
            return next(error);
        }
        return res.status(200).json(data.value);
    } catch (err) {
        err.message = 'Server error'
        err.statusCode = 500;
        return next(err);
    }
}
