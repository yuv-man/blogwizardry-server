import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';
import { enumLanguage } from '../../enum/enumLanguage.js';

const generateBlogPost = async (topic, style, keywords, language) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" }); // Use latest model version
    
    // Update prompt to explicitly request a structured format
    const prompt = `Write a blog post in ${enumLanguage[language]} about ${topic} in ${style} style. 
    Include the following keywords: ${keywords}

    Please follow this exact structure:
    1. Title: Create an engaging, SEO-friendly title in ${language}
    2. Excerpt: Write 2-3 sentences that summarize the main points in ${language}
    3. Main Content: Write the full blog post in ${language}, organized with clear headings and paragraphs

    Format the response exactly as:
    # Title
    
    Excerpt
    
    Content`;
    
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