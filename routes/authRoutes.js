const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { isGuest } = require('../middlewares/auth');

//get and post requests to register and login
//logout route
router.get('/register', isGuest, authController.renderRegister);
router.post('/register', isGuest, authController.register);
router.get('/login', isGuest, authController.renderLogin);
router.post('/login', isGuest, authController.login);
router.get('/logout', authController.logout);

module.exports = router;