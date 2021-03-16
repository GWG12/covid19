// Utils
import { genRefreshToken } from '../util/auth.js';
// Models
import { Statistics } from '../models/statistics.js';
// MongoDB
import mongoDb from 'mongodb';
import fetch from 'node-fetch';


export const sync = async (req, res, next) => {
    const rawData = await fetch(process.env.API_URL, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.X_RAPIDAPI_KEY,
            'x-rapidapi-host': process.env.X_RAPIDAPI_HOST,
            'useQueryString': true
        },
    });
    if (!rawData) {
        const error = new Error('Could not fetch the data, please try again');
        error.statusCode = 500;
        return next(error);
    }
    const jsonData = await rawData.json();
    if (!jsonData) {
        const error = new Error('Could not fetch the data, please try again');
        error.statusCode = 500;
        return next(error);
    }
    const { data, error } = await Statistics.syncDatabase(jsonData.response);
    if (error) return next(error);
    return res.status(200).json(data);
}

