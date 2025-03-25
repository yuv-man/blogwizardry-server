import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

// @desc    Save generated post to database
// @route   POST /posts/save
// @access  Private
const savePost = async (req, res) => {
  try {
    const { title, content, excerpt, author, status, createAt, updateAt } = req.body;
    
    if (!title || !content || !author) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide title, content, and topic'
      });
    }
    
    const post = await Post.create({
      title,
      content,
      excerpt,
      author,
      status,
      createAt,
      updateAt
    });
    
    res.status(201).json({
      status: 'success',
      data: {
        post
      }
    });
  } catch (error) {
    logger.error('Error saving post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save blog post'
    });
  }
};

// @desc    Get user's saved posts
// @route   GET /posts/user
// @access  Private
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort('-createdAt');
    
    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    });
  } catch (error) {
    logger.error('Error getting user posts:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve posts'
    });
  }
};

// @desc    Get single post
// @route   GET /posts/:id
// @access  Public
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username');
    
    if (!post) {
      return res.status(404).json({
        status: 'fail',
        message: 'Post not found'
      });
    }

    const author = await User.findById(post.author);
    const authorName = author.username;
    res.status(200).json({
      status: 'success',
      data: {
        post: {
          _id: post._id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          author: post.author,
          status: post.status,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          authorName: authorName
        }
      }
    });
  } catch (error) {
    logger.error('Error getting post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve post'
    });
  }
};

// @desc    Get all posts by user ID
// @route   GET /posts/all/:userId
// @access  Public
const getAllPostsByUserId = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId.createFromHexString(req.params.userId);
    const posts = await Post.find({ 
      author: userId
    }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    });
  } catch (error) {
    logger.error('Error getting all posts by user ID:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve posts'
    });
  } 
};

// @desc    Get all posts
// @route   GET /posts/all
// @access  Public
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts
      }
    });
  } catch (error) {
    logger.error('Error getting all posts:', error);  
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve posts'
    });
  }
};

// @desc    Delete post
// @route   DELETE /posts/:id
// @access  Private
const deletePost = async (req, res) => {
  try { 
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      message: 'Post deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete post'
    });
  }
};

// @desc    Update post
// @route   PUT /posts/:id
// @access  Private
const updatePost = async (req, res) => {
  try { 
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({
      status: 'success',
      data: {
        post
      } 
    });
  } catch (error) {
    logger.error('Error updating post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update post'
    });
  }
};

// @desc    Search posts
// @route   GET /posts/search
// @access  Public
const searchPosts = async (req, res) => {
  try { 
    const { query } = req.query;
    const posts = await Post.find({ $text: { $search: query } }).sort('-createdAt');
    res.status(200).json({
      status: 'success',
      results: posts.length,  
      data: {
        posts
      }
    });
  } catch (error) {
    logger.error('Error searching posts:', error);  
    res.status(500).json({
      status: 'error',
      message: 'Failed to search posts'
    });
  }
};

export { savePost, getUserPosts, getPost, getAllPostsByUserId, getAllPosts, deletePost, updatePost, searchPosts };