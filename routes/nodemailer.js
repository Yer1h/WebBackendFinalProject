const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
        user: '230907@astanait.edu.kz',
        pass: 'knDGG85TgZzIc',
    },
});



router.get('/', (req, res) => {
    res.render('nodemailer', { message: null });
});

router.post('/send', (req, res) => {
    const { toEmail, messageText } = req.body;
    if (!toEmail || !messageText) {
        return res.render('nodemailer', { message: 'Please provide both email and message' });
    }

    const mailOptions = {
        from: '230907@astanait.edu.kz', 
        to: toEmail, 
        subject: 'Message from Web App',
        text: messageText, 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
            return res.render('nodemailer', { message: 'Error sending email' });
        }
        console.log('Email sent:', info.response);
        res.render('nodemailer', { message: 'Email sent successfully' });
    });
});

module.exports = router;