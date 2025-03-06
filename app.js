//Import 
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const database = require('./config/db')
const Book = require('./models/Book');
const bookRoutes = require('./routes/book.routes');
const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
require('dotenv').config({ path: './.env' });


dotenv.config() // load .env variables

//Initialize express app
const app = express()

//middleware
app.use(cors()) // CORS headers
app.use(express.json()) // body parser

console.log("DB_URI:", process.env.DB_URI); // Debugging line


// connect to MongoDB
database(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB ✅'))
    .catch(err => console.error(`Connection to MongoDB failed ❌: ${err.message}`));

//routes

//route for book
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', authMiddleware, bookRoutes);


// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

console.log(Book);
console.log("MONGO_URI:", process.env.MONGO_URI);

console.log('Starting server...');
console.log('DB_URI:', process.env.DB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('PORT:', process.env.PORT);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})