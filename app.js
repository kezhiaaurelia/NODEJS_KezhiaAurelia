const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

// MongoDB Connect
mongoose.connect('mongodb://127.0.0.1:27017/dapodik')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Session + Flash
app.use(session({
  secret: 'dapodik-secret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Global Variables for Flash + User Session
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/siswa', require('./routes/siswa'));
app.use('/logout', require('./routes/logout'));

// Home Page
app.get('/home', (req, res) => {
  if (!req.session.user) {
    req.flash('error_msg', 'Silakan login terlebih dahulu');
    return res.redirect('/');
  }
  res.render('home', { user: req.session.user });
});

// Run Server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
