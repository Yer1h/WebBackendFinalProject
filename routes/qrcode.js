const express = require('express');
const qr = require('qr-image');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('qrcode', { qrCode: null, error: null });
});

router.post('/generate', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.render('qrcode', { qrCode: null, error: 'Please enter a URL' });
    }

    const filePath = path.join(__dirname, '../public', 'qrcode.png');
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 

    try {
        const qrCode = qr.image(url, { type: 'png' });
        qrCode.pipe(fs.createWriteStream(filePath))
            .on('finish', () => {
                res.render('qrcode', { qrCode: '/qrcode.png', error: null });
            })
            .on('error', (err) => {
                res.render('qrcode', { qrCode: null, error: 'Error generating QR code' });
            });
    } catch (err) {
        res.render('qrcode', { qrCode: null, error: 'Invalid URL or server error' });
    }
});

module.exports = router;