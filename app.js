const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const bmiRoutes = require('./routes/bmi');
const weatherRoutes = require('./routes/weather');
const nodemailerRoutes = require('./routes/nodemailer');
const crudRoutes = require('./routes/crud');
const qrcodeRoutes = require('./routes/qrcode');
const adminRoutes = require('./routes/admin');
const methodOverride = require('method-override');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method')); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/login');
};

app.get('/', (req, res) => {
    res.redirect('/login'); 
});

app.use('/', authRoutes);
app.use('/bmi', isAuthenticated, bmiRoutes);
app.use('/weather', isAuthenticated, weatherRoutes);
app.use('/nodemailer', isAuthenticated, nodemailerRoutes);
app.use('/blogs', isAuthenticated, crudRoutes);
app.use('/qrcode', isAuthenticated, qrcodeRoutes);
app.use('/admin', isAuthenticated, adminRoutes);

app.get('/home', isAuthenticated, (req, res) => {
    res.render('home', { user: req.session.user });
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));