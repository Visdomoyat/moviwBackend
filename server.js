require ('dotenv').config();
// const dotenv = require('dotenv');
// dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');
const testJwtRouter = require('./controllers/test-jwt');
const authController = require('./controllers/auth')
const userController = require('./controllers/user')
const serviceController = require("./controllers/service.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
const ALLOWED_ORIGINS = [
    'https://visdom-dev.netlify.app', 
    'http://localhost:3000'
];

// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
console.log('Allowed Origins:', ALLOWED_ORIGINS )
app.use(cors({
  origin: (origin, callback) => {
    if(!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`))
    }
  }
}));

app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use('/test-jwt', testJwtRouter);
app.use('/auth', authController)
app.use('/users', userController)
app.use("/service", serviceController);

app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({message: "Internal Server Error"})
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The express app is running on port ${PORT}!`);
});
