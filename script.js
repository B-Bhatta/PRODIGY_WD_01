const apiKey = '1d766de92d08d766a48461f9dd809eba'; 
const weatherInfo = document.getElementById('weatherInfo');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const error = document.getElementById('error');

async function getWeatherByLocation() {
    const location = document.getElementById('locationInput').value.trim(); // Trim whitespace
    if (!location) {
        error.textContent = 'Please enter a city name.';
        weatherInfo.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('City not found. Please check the spelling or try another city.');
            }
            throw new Error('An error occurred while fetching weather data.');
        }
        const data = await response.json();
        displayWeather(data);
        error.textContent = '';
    } catch (err) {
        error.textContent = err.message;
        weatherInfo.style.display = 'none';
    }
}

async function getWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error('Invalid API key. Please check your API key.');
                    }
                    throw new Error('Unable to fetch weather data for your location. Please try again later.');
                }
                const data = await response.json();
                displayWeather(data);
                error.textContent = '';
            } catch (err) {
                error.textContent = err.message;
                weatherInfo.style.display = 'none';
            }
        }, (err) => {
            let errorMessage = 'Geolocation access denied. Please enter a city manually.';
            if (err.code === err.PERMISSION_DENIED) {
                errorMessage = 'Geolocation permission denied. Please allow location access or enter a city manually.';
            } else if (err.code === err.POSITION_UNAVAILABLE) {
                errorMessage = 'Location information is unavailable. Please enter a city manually.';
            } else if (err.code === err.TIMEOUT) {
                errorMessage = 'The request to get your location timed out. Please try again or enter a city manually.';
            }
            error.textContent = errorMessage;
            weatherInfo.style.display = 'none';
        });
    } else {
        error.textContent = 'Geolocation is not supported by your browser. Please enter a city manually.';
        weatherInfo.style.display = 'none';
    }
}

function displayWeather(data) {
    weatherInfo.style.display = 'block';
    cityName.textContent = data.name;
    temperature.textContent = `Temperature: ${data.main.temp}°C`;
    description.textContent = `Condition: ${data.weather[0].description}`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
}