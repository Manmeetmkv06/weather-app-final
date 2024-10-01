const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check authentication
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
}

// Get weather data from OpenWeatherMap
app.get('/weather', authenticateToken, async (req, res) => {
    const { city } = req.query;

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching weather data' });
    }
});

// User login and token generation
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Username required' });

    const user = { name: username };
    const token = jwt.sign(user, JWT_SECRET);
    res.json({ token });
});

// Error handling for unexpected routes
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
