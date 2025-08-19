require('express-async-errors')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const dotenv = require('dotenv')
const database = require('./config/db')
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.config')
const bookRoutes = require('./routes/book.routes');
const authRoutes = require('./routes/auth.routes');
const homeRoute = require(`./routes/home.routes`)
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
require('dotenv').config({ path: './.env' });
dotenv.config()

const app = express()

if (process.env.TRUST_PROXY) app.set('trust proxy', Number(process.env.TRUST_PROXY));
const allowedOrigins = process.env.FRONTEND_ORIGIN?.split(",").map(o => o.trim()) || [];


app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "connect-src": ["'self'", ...allowedOrigins],
        "img-src": ["'self'", "data:", "blob:", "*.cloudinary.com"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "script-src": ["'self'"],
      },
    },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600, 
  })
);


app.use(express.json({ limit: '1mb' })) 
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: ['tags'],
  })
);

const apiLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX || 200),                       
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
  keyGenerator: (req) => req.ip,
});

app.use('/api', apiLimiter);

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 20,
  message: { message: 'Too many login attempts. Try again later.' },
});

app.use('/api/auth/login', authLimiter);

//routes
//route for book
app.use('/', homeRoute)
app.use('/api/auth', authRoutes);
app.use('/api/books', authMiddleware, bookRoutes);

app.disable('x-powered-by');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 Handler
app.use(notFound);
// Error Handler
app.use(errorHandler);

module.exports = app;

