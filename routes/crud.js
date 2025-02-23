const express = require('express');
const Blog = require('../models/blog');
const methodOverride = require('method-override');

const router = express.Router();

const isAuthenticated = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/login');
};

const isAuthorOrAdmin = async (req, res, next) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.render('blogs', { blogs: null, user: req.session.user, error: 'Blog not found' });
        if (req.session.user.username === blog.author || req.session.user.role === 'admin') return next();
        res.status(403).send('Access denied. Only the author or admins can edit this post.');
    } catch (err) {
        res.render('blogs', { blogs: null, user: req.session.user, error: 'Error checking permissions' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') return next();
    res.status(403).send('Access denied. Only admins can delete posts.');
};

router.use(methodOverride('_method'));

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }); 
        res.render('blogs', { blogs, user: req.session.user, error: null });
    } catch (err) {
        res.render('blogs', { blogs: null, user: req.session.user, error: 'Error fetching blogs' });
    }
});

router.post('/', isAuthenticated, async (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) return res.render('blogs', { blogs: null, user: req.session.user, error: 'Title and body are required' });

    try {
        const blog = new Blog({
            title,
            body,
            author: req.session.user.username,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await blog.save();
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.render('blogs', { blogs, user: req.session.user, error: null });
    } catch (err) {
        res.render('blogs', { blogs: null, user: req.session.user, error: 'Error creating blog post' });
    }
});

router.put('/:id', isAuthenticated, isAuthorOrAdmin, async (req, res) => {
    const { title, body } = req.body;
    if (!title || !body) return res.render('blogs', { blogs: null, user: req.session.user, error: 'Title and body are required' });

    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, {
            title,
            body,
            updatedAt: new Date() 
        }, { new: true });
        if (!blog) return res.render('blogs', { blogs: null, user: req.session.user, error: 'Blog not found' });
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.render('blogs', { blogs, user: req.session.user, error: null });
    } catch (err) {
        res.render('blogs', { blogs: null, user: req.session.user, error: 'Error updating blog post' });
    }
});

router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) return res.render('blogs', { blogs: null, user: req.session.user, error: 'Blog not found' });
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.render('blogs', { blogs, user: req.session.user, error: null });
    } catch (err) {
        res.render('blogs', { blogs: null, user: req.session.user, error: 'Error deleting blog post' });
    }
});

module.exports = router;