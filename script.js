function getWeather() {
    const apiKey = 'YOUR-API-KEY';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Fetch current weather data
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Could not fetch weather data. Please try again.');
        });

    // Fetch 24-hour forecast data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => displayHourlyForecast(data.list))
        .catch(error => {
            console.error('Error fetching forecast data:', error);
            alert('Could not fetch forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDiv = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyHeading = document.getElementById('hourly-heading');

    // Clear previous content
    tempDiv.innerHTML = '';
    weatherInfoDiv.innerHTML = '';
    hourlyHeading.style.display = 'none';
    weatherIcon.style.display = 'none';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15); // Convert from Kelvin to Celsius
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        tempDiv.innerHTML = `<p>${temperature}°C</p>`;
        weatherInfoDiv.innerHTML = `<p>${cityName}</p><p>${description}</p>`;
        weatherIcon.src = iconUrl;
        weatherIcon.style.display = 'block';
    }
}

function displayHourlyForecast(forecastData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const hourlyHeading = document.getElementById('hourly-heading');

    // Clear previous forecast
    hourlyForecastDiv.innerHTML = '';
    hourlyHeading.style.display = 'block';

    // Display the next 8 three-hour intervals (24 hours)
    forecastData.slice(0, 8).forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15); // Convert to Celsius
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItem = document.createElement('div');
        hourlyItem.className = 'hourly-item';
        hourlyItem.innerHTML = `
            <div>${hour}:00</div>
            <img src="${iconUrl}" alt="Weather Icon">
            <div>${temperature}°C</div>
        `;

        hourlyForecastDiv.appendChild(hourlyItem);
    });
}
