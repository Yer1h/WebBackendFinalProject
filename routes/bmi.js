const express = require('express');

const router = express.Router();

router.get('/', (req, res) => res.render('bmi', { result: null }));
router.post('/calculate', (req, res) => {
    const { weight, height } = req.body;
    if (weight <= 0 || height <= 0) {
        return res.render('bmi', { result: 'Invalid input' });
    }
    
    const bmi = weight / (height * height);
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 24.9) category = 'Normal weight';
    else if (bmi < 29.9) category = 'Overweight';
    else category = 'Obese';
    
    res.render('bmi', { result: `Your BMI is ${bmi.toFixed(2)}. Category: ${category}` });
});

module.exports = router;