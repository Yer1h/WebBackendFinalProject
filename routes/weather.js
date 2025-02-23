const express = require('express');
const axios = require('axios');

const router = express.Router();
const weatherApiKey = '53bb36f4ca6f0ffbb840d16a20f6a03d'; 

router.get('/', async (req, res) => {
    const city = req.query.city || 'Astana';
    try {
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}&units=metric`
        );
        const weatherData = weatherResponse.data;

        const { lat, lon } = weatherData.coord;

        const airQualityResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${weatherApiKey}`
        );
        const airQualityData = airQualityResponse.data.list[0].components; 

        const pm25 = airQualityData.pm2_5;
        let aqi;
        if (pm25 <= 12) aqi = 50;  
        else if (pm25 <= 35.4) aqi = 100;  
        else if (pm25 <= 55.4) aqi = 150;  
        else if (pm25 <= 150.4) aqi = 200;  
        else if (pm25 <= 250.4) aqi = 300; 
        else aqi = 500;  

        const weatherInfo = {
            city: weatherData.name, 
            temperature: weatherData.main.temp,
            description: weatherData.weather[0].description,
            icon: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
            coordinates: { lat, lon },
            feelsLike: weatherData.main.feels_like,
            humidity: weatherData.main.humidity,
            pressure: weatherData.main.pressure,
            windSpeed: weatherData.wind.speed,
            countryCode: weatherData.sys.country,
            aqi: aqi,
            flag: `https://flagcdn.com/32x24/${weatherData.sys.country.toLowerCase()}.png`
        };

        res.render('weather', { weatherInfo, error: null });
    } catch (err) {
        console.error('Error fetching weather or air quality:', err.message);
        res.render('weather', { weatherInfo: null, error: 'Error fetching weather data' });
    }
});

module.exports = router;