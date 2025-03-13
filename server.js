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
const hootsController = require("./controllers/hoots.js");
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use('/test-jwt', testJwtRouter);
app.use('/auth', authController)
app.use('/users', userController)
app.use("/hoots", hootsController)

app.listen(3002, () => {
  console.log('The express app is ready!');
});
