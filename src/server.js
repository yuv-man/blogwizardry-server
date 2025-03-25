import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';
import router from './router.js'
import dotenv from 'dotenv';

// Initialize express app
dotenv.config();
class Server {

    constructor() {
        const app = express();
        const allowedOrigins = ['https://blogwizardry.onrender.com', 'http://localhost:8080'];

        const corsOptions = process.env.NODE_ENV === 'development' 
            ? { origin: 'http://localhost:8080', credentials: true } 
            : { 
                origin: function (origin, callback) {
                    if (!origin || allowedOrigins.includes(origin)) {
                      callback(null, true);
                    } else {
                      callback(new Error('Not allowed by CORS'));
                    }
                  },
                  credentials: true,
            };
        
        app.use(cors(corsOptions));
        this.app = app;
        
        // Middleware setup
        this.setupMiddleware();
        this.app.use(router);
    }

    setupMiddleware() {
        // Basic middleware
        
        // this.app.use(cors(corsOptions));
        this.app.use(express.json());

        // Request logging
        this.app.use((req, res, next) => {
            logger.info(`${req.method} ${req.url}`);
            next();
        }); 

        // Rate limiting
        const apiLimiter = rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again after 15 minutes',
            standardHeaders: true,
            legacyHeaders: false,
        });

        this.app.use('/api', apiLimiter);

        // Error handling middleware
        this.app.use((err, req, res, next) => {
            logger.error(err.stack);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong!',
                error: process.env.NODE_ENV === 'development' ? err.message : {}
            });
        });
    }

    start() {
        const port = process.env.PORT || 5000;
        this.app.listen(port, () => {
            logger.info(`Server is running on port ${port}`);
        });
    }
}

export const server = new Server();