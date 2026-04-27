require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Passport config
require('./config/passport');

const courses = require('./data/courses');

const app = express();

// Security & Optimization
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "lh3.googleusercontent.com"],
    },
  },
}));
app.use(compression());
app.use(morgan('dev'));

// Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taleem360';
app.use(session({
  secret: process.env.SESSION_SECRET || 'taleem360-ai-secret-2026',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.siteName = 'Taleem360 AI Learning';
  next();
});

// Routes
app.get('/', (req, res) => {
  const featured = courses.slice(0, 6);
  const stats = {
    totalCourses: courses.length,
    totalLessons: courses.reduce((acc, c) => acc + c.lessons, 0),
    freeCourses: courses.filter(c => c.isFree).length
  };
  res.render('pages/home', { 
    title: 'Taleem360 AI Learning | Home',
    currentPage: 'home',
    featured,
    stats
  });
});

app.get('/courses', (req, res) => {
  res.render('pages/courses', { 
    title: 'All Modules | Taleem360',
    currentPage: 'courses',
    courses 
  });
});

app.get('/courses/:slug', (req, res) => {
  const course = courses.find(c => c.slug === req.params.slug);
  if (!course) return res.status(404).render('pages/404', { title: '404 - Not Found' });
  
  res.render('pages/course-detail', { 
    title: `${course.title} | Taleem360`,
    currentPage: 'courses',
    course 
  });
});

app.get('/about', (req, res) => {
  res.render('pages/about', { 
    title: 'About Us | Taleem360',
    currentPage: 'about'
  });
});

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/login');
  res.render('pages/dashboard', { title: 'Student Dashboard', user: req.user });
});

app.get('/login', (req, res) => {
  res.render('pages/login', { title: 'Login | Taleem360' });
});

// Auth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => res.redirect('/dashboard')
);
app.get('/auth/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('pages/404', { title: '404 - Not Found' });
});

// Database connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✓ Taleem360 MongoDB Connected'))
  .catch(err => console.error('✗ MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✓ Taleem360 Server running on http://localhost:${PORT}`);
});
