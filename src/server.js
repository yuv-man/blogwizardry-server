import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';
import router from './router.js'

// Initialize express app
class Server {

    constructor() {
        const app = express();
        app.use(cors({
          origin: 'http://localhost:8080',
          credentials: true
        }));
        this.app = app;
        
        // Middleware setup
        this.setupMiddleware();
        this.app.use(router);
    }

    setupMiddleware() {
        // Basic middleware
        // const corsOptions = process.env.NODE_ENV === 'development' 
        //     ? { origin: true, credentials: true } // Allow all origins in development
        //     : { origin: process.env.ALLOWED_ORIGINS?.split(',') || [] }; // Restricted in production
        
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