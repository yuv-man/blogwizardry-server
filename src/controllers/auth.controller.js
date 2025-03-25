import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
import logger from '../utils/logger.js';

// @desc    Register a new user
// @route   POST /auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log(req.body);
    
    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
      return res.status(400).json({
        status: 'fail',
        message: 'User already exists'
      });
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password
    });
    
    if (user) {
      res.status(201).json({
        status: 'success',
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid user data'
      });
    }
  } catch (error) {
    logger.error('Error registering user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// @desc    Auth user & get token
// @route   POST /auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and password is correct
    if (user && await user.comparePassword(password)) {
      res.json({
        status: 'success',
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          token: generateToken(user._id)
        }
      });
    } else {
      res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    logger.error('Error logging in user:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

const getAuthorName = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.params.userId);
  const user = await User.findById(userId);
  res.json({
    status: 'success',
    data: {
      name: user.username
    }
  });
};

export { registerUser, loginUser, getAuthorName };