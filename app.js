const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const connectDB = require('./config/db')
const User = require('./models/User')

dotenv.config({path:'./.env'})

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(async (req, res, next) => {
    const token = req.cookies.token
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        res.locals.user = user
      } catch (error) {
        console.error('JWT verification error:', error)
        res.locals.user = null
      }
    } else {
      res.locals.user = null
    }
    next()
})

app.use('/auth', require('./routes/auth')) // /auth/login that kinda stuff

app.get('/',(req,res) =>{
    res.render('index') //homepage
})

// /dashboard requests will first pass through isAuthenticated middleware
app.get('/dashboard',require('./middlewares/authMiddleware').isAuthenticated,(req,res) => {
    res.render('dashboard')
})

app.use((req, res) => {
    res.status(404).render('404')
})


app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).render('error', { error: err })
})


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
