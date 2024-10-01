import React, { useState } from 'react';
import axios from 'axios';
import '../styles/App.css'; 

function App() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [token, setToken] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: 'user123',
            });
            setToken(response.data.token);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const handleGetWeather = async () => {
        if (!token) return alert('Please log in first');
        
        try {
            const response = await axios.get('http://localhost:5000/weather', {
                params: { city },
                headers: {
                    Authorization: token,
                },
            });
            setWeather(response.data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    return (
        <div className="App">
            <h1>Weather App</h1>
            {!isLoggedIn ? (
                <button onClick={handleLogin}>Login</button>
            ) : (
                <div>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city"
                    />
                    <button onClick={handleGetWeather}>Get Weather</button>
                    {weather && (
                        <div>
                            <h3>Weather in {city}</h3>
                            <p>Temperature: {weather.main.temp}°C</p>
                            <p>Weather: {weather.weather[0].description}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
