const express = require('express');
const User = require('../models/user');

const router = express.Router();

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') return next();
    res.status(403).send('Access denied');
};

router.get('/', isAdmin, async (req, res) => {
    const users = await User.find({}, 'username role createdAt');
    res.render('admin', { users });
});

module.exports = router;