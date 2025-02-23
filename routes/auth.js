const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

router.get('/login', (req, res) => res.render('login'));
router.get('/register', (req, res) => res.render('register'));

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send('Enter all fields');
    if (await User.findOne({ username })) return res.status(400).send('User exists');
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.redirect('/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).send('Wrong username or password');
    }
    req.session.user = user;
    res.redirect('/home');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

router.get('/setup-admin', async (req, res) => {
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await new User({ username: 'admin', password: hashedPassword, role: 'admin' }).save();
        res.send('Admin created');
    } else {
        res.send('Admin already exists');
    }
});

module.exports = router;