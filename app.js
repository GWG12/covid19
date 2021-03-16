import express from 'express';
import path from 'path';
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

app.use((error, req, res, next) => {
    console.log('En error middleware')
    console.log(error.message)
    console.log(error.status)
    console.log("Fin del middleware")
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

// MongoDB Atlas connection
mongoConnect(() => {
    app.listen(8000, () => {
        console.log('server started')
    });
});


