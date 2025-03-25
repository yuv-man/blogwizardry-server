import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

const generateBlogPost = async (topic, style, keywords) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use latest model version
    
    // Update prompt to explicitly request a structured format
    const prompt = `Write a blog post about ${topic} in ${style} style. Keywords: ${keywords}
    Please structure it with:
    - A title
    - A brief excerpt/summary (2-3 sentences)
    - The main content`;
    
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    
    // Split content into sections
    const sections = generatedText.split('\n\n');
    
    // Extract title, excerpt, and content
    const title = sections[0].replace(/^#\s+/, '');
    const excerpt = sections[1] || ''; // Get the second section as excerpt
    const content = generatedText;
    
    return {
      title,
      excerpt,
      content
    };
  } catch (error) {
    logger.error('Error generating blog post:', error);
    throw new Error('Failed to generate blog post');
  }
};

export default {
  generateBlogPost
};