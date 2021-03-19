import express from 'express';
import bodyParser from 'body-parser';
import { mongoConnect } from './util/database.js';
import dotenv from 'dotenv';
// Routes
import authRoutes from './routes/auth.js';
import tokenRoutes from './routes/token.js';
import syncRoutes from './routes/sync.js';
import statisticsRoutes from './routes/statistics.js';

// Joi errors link
// https://hapi.dev/module/joi/api/?v=17.1.1#list-of-errors

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(multer({storage:storage,fileFilter:fileFilter}).single('image'));
//app.use('/images',express.static(path.join(__dirname,'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/token', tokenRoutes);
app.use('/sync', syncRoutes);
app.use('/statistics', statisticsRoutes);

// Errors
app.use((error, req, res, next) => {
    let message;
    const status = error.statusCode || 500;
    if (error.details) {
        message = error.details.map(getErrorsJoi);
    } else {
        message = error.message;
    }
    const data = error.data || "validation error";
    res.status(status).json({ message: message, data: data });
});

function getErrorsJoi(item) {
    return item.message
}

const PORT = process.env.PORT || 8000;

// MongoDB Atlas connection
mongoConnect(() => {
    app.listen(PORT, () => {
        console.log(`server started at ${PORT}`)
    });
});


