require('express-async-errors')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const helmet = require('helmet')
const database = require('./config/db')
const bookRoutes = require('./routes/book.routes');
const authRoutes = require('./routes/auth.routes');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
require('dotenv').config({ path: './.env' });
dotenv.config()

const app = express()

app.use(express.json()) 
app.use(helmet()); 
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5137'], // **IMPORTANT: Replace with your actual frontend URL**
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


console.log("DB_URI:", process.env.DB_URI); // Debugging line


database(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB ✅'))
    .catch(err => console.error(`Connection to MongoDB failed ❌: ${err.message}`));

//routes

//route for book
app.use('/api/auth', authRoutes);
app.use('/api/books', authMiddleware, bookRoutes);



// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

