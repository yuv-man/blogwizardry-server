import express from 'express';
import { generatePost } from '../controllers/generate.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/generate', protect, generatePost);

export default router;