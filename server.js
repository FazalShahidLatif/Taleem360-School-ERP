require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const { MongoStore } = require('connect-mongo');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// Passport config
require('./config/passport');

const courses = require('./data/courses');
const blogPosts = require('./data/blog');

const app = express();

// Trust proxy for Hostinger/Load Balancers
app.set('trust proxy', 1);

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

// Database connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taleem360';

// Session configuration with MongoDB fallback
let sessionStore;
try {
  sessionStore = MongoStore.create({ 
    mongoUrl: MONGODB_URI,
    collectionName: 'sessions',
    ttl: 14 * 24 * 60 * 60 // 14 days
  });
  console.log('✓ MongoStore initialized');
} catch (err) {
  console.log('⚠ MongoStore failed, falling back to MemoryStore');
  sessionStore = null; // MemoryStore is the default when store is not provided
}

app.use(session({
  secret: process.env.SESSION_SECRET || 'taleem360-ai-secret-2026',
  resave: false,
  saveUninitialized: false,
  store: sessionStore || undefined, // Fallback to memory store
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

// Blog Routes
app.get('/blog', (req, res) => {
  res.render('pages/blog', {
    title: 'Blog | Taleem360 AI Learning',
    metaDesc: 'Stay updated with the latest in AI education, tool mastery, and freelancing skills tailored for the Pakistani market.',
    currentPage: 'blog',
    posts: blogPosts
  });
});

app.get('/blog/:slug', (req, res) => {
  const post = blogPosts.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).render('pages/404', { title: '404 - Post Not Found' });
  
  const related = blogPosts.filter(p => p.slug !== post.slug).slice(0, 3);
  
  res.render('pages/blog-detail', {
    title: post.metaTitle,
    metaDesc: post.metaDesc,
    currentPage: 'blog',
    post,
    related
  });
});

// Sitemap Route
app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://taleem360.online';
  const staticPages = ['', '/courses', '/about', '/blog', '/login'];
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  
  // Add static pages
  staticPages.forEach(page => {
    xml += `<url><loc>${baseUrl}${page}</loc><changefreq>weekly</changefreq><priority>${page === '' ? '1.0' : '0.8'}</priority></url>`;
  });
  
  // Add courses
  courses.forEach(course => {
    xml += `<url><loc>${baseUrl}/courses/${course.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`;
  });
  
  // Add blog posts
  blogPosts.forEach(post => {
    xml += `<url><loc>${baseUrl}/blog/${post.slug}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`;
  });
  
  xml += '</urlset>';
  
  res.header('Content-Type', 'application/xml');
  res.send(xml);
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
