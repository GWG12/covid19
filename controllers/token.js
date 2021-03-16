// Utils
import { genRefreshToken } from '../util/auth.js';
// Models
import { Token } from '../models/token.js';
// MongoDB
import mongoDb from 'mongodb';


export const refresh = async (req, res, next) => {
    if (!mongoDb.ObjectId.isValid(req.body.userId)) {
        const error = new Error("Invalid user");
        error.statusCode = 403;
        return next(error);
    }
    const userId = new mongoDb.ObjectId(req.body.userId);
    console.log('cookies ', req.headers.cookie)
    if (!req.headers.cookie || !req.headers.cookie.split('=')[1]) {
        const error = new Error("Invalid credentials");
        error.statusCode = 403;
        return next(error);
    }
    const token = req.headers.cookie.split('=')[1];
    console.log('el token ', req.headers.cookie.split('=')[1])
    const { accessToken, refreshToken, error } = await genRefreshToken(userId, token);
    if (error) return next(error);
    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    return res.status(200).json({ accesToken: accessToken });
}

export const revoke = async (req, res, next) => {
    if (!mongoDb.ObjectId.isValid(req.body.userId)) {
        const error = new Error("Invalid user");
        error.statusCode = 403;
        return next(error);
    }
    const userId = new mongoDb.ObjectId(req.body.userId);
    const { data, error } = await Token.revokeRefreshToken(userId);
    if (error) return next(error);
    if (data.matchedCount === 0) {
        const error = new Error("User not found")
        error.statusCode = 404;
        return next(error);
    }
    if (data.modifiedCount === 0) {
        const error = new Error("Server error")
        error.statusCode = 409;
        return next(error);
    }
    return res.status(204).json();
}
