const jwt = require('jsonwebtoken');
const Uset = require('../models/User')

//verify the token from the cookie 
//this middleware will be executed before a user accesses protected routes
//checks if the token is valid, checks if its not been tampered with by checking signature
//redirects to login page if jwt is invalid
exports.isAuthenticated = async (req,res,next) => { 
    const token = req.cookies.token
    if (!token){
        res.redirect('/auth/login')
    }
    try{ 
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findByID(decoded.id)
        if(!user){
            return res.redirect('/auth/login')
        }
        req.user = user
        res.locals.user = user
        next()
    }catch(error){
        console.error('Auth middleware error:', error)
        res.clearCookie('token')
        res.redirect('/auth/login')
    }
}

exports.isGuest =  (req,res,next) => {
    const token = req.cookies.token
    if (token){
        try{
            jwt.verify(token,process.env.JWT_SECRET)
            return res.redirect('/dashboard')
        }catch (error){
            res.clearCookie('token')
        }
    }
    next()
}