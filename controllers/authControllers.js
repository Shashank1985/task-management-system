const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).render('auth/register', {
        error: 'User already exists',
        formData: req.body
      });
    }

    user = await User.findOne({ username });
    if (user) {
      return res.status(400).render('auth/register', {
        error: 'Username already taken',
        formData: req.body
      });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      personalTasks: [],
      workspaces: []
    });

    await user.save();

    // Generate JWT token
    const token = user.generateAuthToken();
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    // Redirect to dashboard
    return res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('auth/register', {
      error: 'Server error occurred during registration',
      formData: req.body
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).render('auth/login', {
        error: 'Invalid credentials',
        formData: { email }
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).render('auth/login', {
        error: 'Invalid credentials',
        formData: { email }
      });
    }

    // Generate JWT token
    const token = user.generateAuthToken();
    
    // Set token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });
    
    // Redirect to dashboard
    return res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('auth/login', {
      error: 'Server error occurred during login',
      formData: req.body
    });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/auth/login');
};

exports.renderLogin = (req, res) => {
    res.render('auth/login', { formData: {}, error: null });
};
  
exports.renderRegister = (req, res) => {
    res.render('auth/register', { formData: {}, error: null });
};

exports.getMe = async (req, res) => {
    try {
      // req.user is already set by the auth middleware
      res.json(req.user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
};