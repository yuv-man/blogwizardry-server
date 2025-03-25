import aiService from '../services/ai.service.js';
import logger from '../utils/logger.js';

// @desc    Generate blog post
// @route   POST /generate
// @access  Private
const generatePost = async (req, res) => {
  try {
    const { topic, style, keywords } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a topic'
      });
    }
    
    // Default style if not provided
    const blogStyle = style || 'informative';
    
    // Generate blog post
    const { title, excerpt, content } = await aiService.generateBlogPost(topic, blogStyle, keywords);
    
    res.status(200).json({
      status: 'success',
      data: {
        title,
        excerpt,
        content
      }
    });
  } catch (error) {
    logger.error('Error generating post:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate blog post'
    });
  }
};

export { generatePost };