// Models
import { User } from '../models/user.js';
import { Token } from '../models/token.js';
// Validators
import { validateSignup, validateLogin } from '../validators/auth.js';
// Security
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';


export const signup = async (req, res, next) => {
    let { error } = validateSignup({
        email: req.body.email,
        password: req.body.password,
        repeat_password: req.body.repeat_password,
    });
    if (error) return next(error);
    const isUserExist = await User.findByEmail(req.body.email);
    if (isUserExist) {
        const error = new Error('This email has already been registered');
        error.statusCode = 404;
        return next(error);
    }
    const hashedPw = await bcrypt.hash(req.body.password, 12);
    if (!hashedPw) {
        const error = new Error('Server error. Please try again');
        return next(error);
    };
    req.body.password = hashedPw;
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    if (!savedUser) {
        const error = new Error('Server error. Please try again');
        return next(error);
    }
    const user = {
        id: savedUser.insertedId,
        email: savedUser.ops[0].email
    }
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.EXP_DATE_ACCESS_TOKEN }
    );
    const jti = uuidv4();
    const refreshToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.EXP_DATE_REFRESH_TOKEN, jwtid: jti }
    );
    const newRefreshToken = new Token({ userId: user.id, refreshToken: jti });
    const savedRefreshedToken = await newRefreshToken.save();
    if (!savedRefreshedToken) {
        const error = new Error('Server error. Please try again');
        return next(error);
    }
    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    return res.status(201).json({ userId: user.id, accessToken: token });
}

export const login = async (req, res, next) => {
    let { error } = validateLogin({
        email: req.body.email,
        password: req.body.password,
    });
    if (error) return next(error);
    const user = await User.findByEmail(req.body.email);
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    const isEqual = await bcrypt.compare(req.body.password, user.password);
    if (!isEqual) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
    }
    const userId = user._id;
    const token = jwt.sign(
        {
            id: userId.toString(),
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.EXP_DATE_ACCESS_TOKEN }
    );
    const jti = uuidv4();
    const refreshToken = jwt.sign(
        {
            id: userId.toString(),
            email: user.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.EXP_DATE_REFRESH_TOKEN, jwtid: jti }
    );
    const isReplacedToken = await Token.replaceRefreshToken(userId, jti);
    if (isReplacedToken.matchedCount === 0) {
        const error = new Error("User not found")
        error.statusCode = 404;
        return next(error);
    }
    if (isReplacedToken.modifiedCount === 0) {
        const error = new Error("Server error")
        error.statusCode = 500;
        return next(error);
    }
    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    return res.status(200).json({ userId: userId, accessToken: token });
}