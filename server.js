require('dotenv').config()
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const { db } = require('./config')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const userRoutes = require('./routes/userRoutes')
const homeRoutes = require('./routes/homeRoutes')
const aboutRoutes = require('./routes/aboutRoutes')
const companyRoutes = require('./routes/companyRoutes')
const teamRoutes = require('./routes/teamRoutes')
const contactRoutes = require('./routes/contactRoutes')

const app = express()

app.use(
  cors({
    origin(origin, callback) {
      return callback(null, true)
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS']
  })
)

app.set('trust proxy', 1)
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

const sessionSecret = process.env.SESSION_SECRET || 'default_secret'
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}))

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Ehcerex Group of Companies Backend API' })
})

// API Routes
app.use('/api/users', userRoutes)
app.use('/api/home', homeRoutes)
app.use('/api/about', aboutRoutes)
app.use('/api/companies', companyRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/contact', contactRoutes)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
