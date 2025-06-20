const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const orderRouter = require('./routes/order');
const categoryRouter = require('./routes/Category');
const authRouter = require('./routes/auth');
const menuRouter = require('./routes/menu'); // renamed for clarity
require('dotenv').config();
const cors = require('cors');

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection failed:', err));

// ✅ Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Routes
app.use('/Order',orderRouter)
app.use('/Category',categoryRouter);
app.use('/auth', authRouter);
app.use('/menu', menuRouter);

// ✅ Catch 404
app.use((req, res, next) => {
  next(createError(404));
});

// ✅ Error Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  // If you're building an API, use JSON response instead of rendering views
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });

  // Uncomment below and comment above if you're rendering views (with Jade/Pug):
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // res.render('error');
});

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
  console.log("mongodb connected");
  
})
.catch((err)=>{
  console.log("connection failed"+err);
  
})

module.exports = app;
