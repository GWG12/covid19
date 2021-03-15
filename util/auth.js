import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Token } from '../models/token.js';


export const genRefreshToken = async (userId, currRefreshToken) => {

    let decodedToken;
    try {
        decodedToken = jwt.verify(currRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log('wigb')
    } catch (err) {
        const error = new Error("Not authorized");
        error.statusCode = 403;
        console.log('error 1 ', error)
        return { error: error };
    }
    if (!decodedToken) {
        const error = new Error('Not authorized');
        error.statusCode = 401;
        return { error: error };
    }
    console.log('token decodificado ', decodedToken)
    const refreshToken = await Token.getRefreshToken(userId, decodedToken.jti);
    console.log('found token ', refreshToken)
    if (!refreshToken) {
        const error = new Error("Not authorized");
        error.statusCode = 403;
        return { error: error };
    }
    const newAccessToken = jwt.sign(
        {
            id: userId,
            email: decodedToken.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.EXP_DATE_ACCESS_TOKEN, jwtid: uuidv4() }
    );
    const jti = uuidv4();
    const newRefreshToken = jwt.sign(
        {
            id: userId.toString(),
            email: decodedToken.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.EXP_DATE_REFRESH_TOKEN, jwtid: jti }
    );
    const isReplacedToken = await Token.replaceRefreshToken(userId, jti);
    if (isReplacedToken.matchedCount === 0) {
        const error = new Error("User not found")
        error.statusCode = 404;
        return { error: error };
    }
    if (isReplacedToken.modifiedCount === 0) {
        const error = new Error("Server error")
        error.statusCode = 409;
        return { error: error };
    }
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

