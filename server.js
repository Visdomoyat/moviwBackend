const dotenv = require('dotenv');
dotenv.config();
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

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true
}));
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use('/test-jwt', testJwtRouter);
app.use('/auth', authController)
app.use('/users', userController)
app.use("/service", serviceController)
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({message: "Internal Server Error"})
})

app.listen(3000, () => {
  console.log('The express app is ready!');
});
