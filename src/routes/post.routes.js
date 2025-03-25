import express from 'express';
import { savePost, getUserPosts, getPost, getAllPostsByUserId, getAllPosts, deletePost, updatePost, searchPosts } from '../controllers/post.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/post/save', protect, savePost);
router.get('/post/user', protect, getUserPosts);
router.get('/post/all', getAllPosts);
router.get('/post/all/:userId', getAllPostsByUserId);
router.get('/post/search', searchPosts);
router.get('/post/:id', getPost);
router.delete('/post/:id', protect, deletePost);
router.put('/post/:id', protect, updatePost);

export default router;