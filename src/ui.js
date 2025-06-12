export const ui = {
  currentUnit: 'F', // Track current temperature unit

  clearUI() {
    document.body.innerHTML = '';
  },

  showLoadingScreen() {
    this.clearUI();

    const wrapper = document.createElement('div');
    wrapper.classList.add('loading-screen');

    const title = document.createElement('h1');
    title.textContent = 'Weatherly';

    const loader = document.createElement('div');
    loader.classList.add('loader');

    const loadingText = document.createElement('p');
    loadingText.textContent = 'Loading weather data...';
    loadingText.classList.add('loading-text');

    wrapper.appendChild(title);
    wrapper.appendChild(loader);
    wrapper.appendChild(loadingText);
    document.body.appendChild(wrapper);
  },

  showErrorScreen(errorMessage, retryCallback) {
    this.clearUI();

    const wrapper = document.createElement('div');
    wrapper.classList.add('error-screen');

    const title = document.createElement('h1');
    title.textContent = 'Weatherly';

    const errorIcon = document.createElement('i');
    errorIcon.classList.add('fa-solid', 'fa-exclamation-triangle');

    const errorText = document.createElement('h2');
    errorText.textContent = 'Oops! Something went wrong';

    const errorDetails = document.createElement('p');
    errorDetails.textContent = errorMessage || 'Failed to fetch weather data';
    errorDetails.classList.add('error-details');

    const retryButton = document.createElement('button');
    retryButton.textContent = 'Try Again';
    retryButton.classList.add('retry-button');
    retryButton.addEventListener('click', retryCallback);

    wrapper.appendChild(title);
    wrapper.appendChild(errorIcon);
    wrapper.appendChild(errorText);
    wrapper.appendChild(errorDetails);
    wrapper.appendChild(retryButton);
    document.body.appendChild(wrapper);
  },

  renderSearchScreen() {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('initial-search');

    // Title
    const title = document.createElement('h1');
    title.textContent = 'Weatherly';

    // Container for input and icon
    const container = document.createElement('div');
    container.classList.add('initial-search-container');

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search for a city...';

    const icon = document.createElement('i');
    icon.classList.add('fa-solid', 'fa-magnifying-glass');

    // Assemble
    container.appendChild(input);
    container.appendChild(icon);
    wrapper.appendChild(title);
    wrapper.appendChild(container);
    document.body.appendChild(wrapper);
  },

  renderPage(weatherData) {
    const container = document.createElement('div');
    container.classList.add('container');

    const leftSide = document.createElement('div');
    leftSide.classList.add('left-side');

    const rightSide = document.createElement('div');
    rightSide.classList.add('right-side');

    // Render sections
    leftSide.appendChild(this.renderHeader(weatherData));
    leftSide.appendChild(this.renderWeather(weatherData));
    rightSide.appendChild(this.renderForecastHourly(weatherData));
    rightSide.appendChild(this.renderForecastDaily(weatherData));
    rightSide.appendChild(this.renderWeatherMetrics(weatherData));

    container.appendChild(leftSide);
    container.appendChild(rightSide);
    document.body.appendChild(container);
  },

  renderHeader(weatherData) {
    const header = document.createElement('div');
    header.classList.add('header');
    header.innerHTML = `
        <div class="search-container">
            <i class="fa-solid fa-location-dot"></i>
            <input type="text" id="citySearch" value="${weatherData.current.city}" />
            <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div class="header-controls">
        <button id="tempToggle" class="temp-toggle">°${this.currentUnit}</button>
        </div>
    `;
    return header;
  },

  renderWeather(weatherData) {
    const weather = document.createElement('div');
    weather.classList.add('weather');

    // Get description, fallback to condition if description is undefined
    const description =
      weatherData.current.description ||
      weatherData.current.condition ||
      'Weather information';

    weather.innerHTML = `
          <div class="degree">
            <h1>${this.convertTemperature(weatherData.current.temp)}°</h1>
            <h2>${weatherData.current.condition}</h2>
            <p>
              ${description}
            </p>
          </div>
          <div class="widgets">
            <div class="feels-like">
              <div class="widg-title">
                <i class="fa-solid fa-temperature-three-quarters"></i>
                <h3>Feels Like</h3>
              </div>
              <div class="content">
                <h2>${this.convertTemperature(weatherData.current.feelsLike)}°</h2>
              </div>
            </div>
            <div class="precipitation">
              <div class="widg-title">
                <i class="fa-solid fa-droplet"></i>
                <h3>Precipitation</h3>
              </div>
              <div class="content">
                <h2>${weatherData.current.precip}"</h2>
                <p class="last-24">in last 24h</p>
                <p class="next-24">${weatherData.current.expectedPrecip}" expected in the next 24h</p>
              </div>
            </div>
            <div class="visibility">
              <div class="widg-title">
                <i class="fa-regular fa-eye"></i>
                <h3>Visibility</h3>
              </div>
              <div class="content">
                <h2>${weatherData.current.visibility} mi</h2>
              </div>
            </div>
            <div class="humidity">
              <div class="widg-title">
                <i class="fa-solid fa-water"></i>
                <h3>Humidity</h3>
              </div>
              <div class="content">
                <h2>${weatherData.current.humidity}%</h2>
                <p>The dew point is <span class="dew">${this.convertTemperature(weatherData.current.dew)}°</span> right now</p>
              </div>
            </div>
          </div>
    `;
    return weather;
  },

  renderForecastHourly(weatherData) {
    const forecastHourly = document.createElement('div');
    forecastHourly.classList.add('forecast', 'hourly');

    const title = document.createElement('div');
    title.classList.add('title');
    title.innerHTML = `
        <i class="fa-regular fa-calendar"></i>
        <h2>HOURLY FORECAST</h2>
    `;

    const hr = document.createElement('hr');

    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast-container');

    // Generate hourly forecast items
    let hourlyHTML = '';
    for (let i = 0; i < Math.min(10, weatherData.hourly.length); i++) {
      hourlyHTML += `
        <div class="forecast-item">
          <p class="time">${weatherData.hourly[i].time}</p>
          <h3 class="temperature">${this.convertTemperature(weatherData.hourly[i].temp)}°</h3>
          <i class="${weatherData.hourly[i].iconClass}"></i>
        </div>
      `;
    }
    forecastContainer.innerHTML = hourlyHTML;

    forecastHourly.appendChild(title);
    forecastHourly.appendChild(hr);
    forecastHourly.appendChild(forecastContainer);

    return forecastHourly;
  },

  renderForecastDaily(weatherData) {
    const forecastDaily = document.createElement('div');
    forecastDaily.classList.add('forecast', 'daily');

    const title = document.createElement('div');
    title.classList.add('title');
    title.innerHTML = `
        <i class="fa-regular fa-calendar"></i>
        <h2>DAILY FORECAST</h2>
    `;

    const hr = document.createElement('hr');

    const forecastContainer = document.createElement('div');
    forecastContainer.classList.add('forecast-container');

    // Generate daily forecast items
    let dailyHTML = '';
    for (let i = 0; i < Math.min(10, weatherData.daily.length); i++) {
      dailyHTML += `
        <div class="forecast-item">
          <p class="day-name">${weatherData.daily[i].day}</p>
          <p class="date">${weatherData.daily[i].date}</p>
          <h3 class="temperature">${this.convertTemperature(weatherData.daily[i].temp)}°</h3>
          <i class="${weatherData.daily[i].iconClass}"></i>
        </div>
      `;
    }
    forecastContainer.innerHTML = dailyHTML;

    forecastDaily.appendChild(title);
    forecastDaily.appendChild(hr);
    forecastDaily.appendChild(forecastContainer);

    return forecastDaily;
  },

  renderWeatherMetrics(weatherData) {
    const weatherMetrics = document.createElement('div');
    weatherMetrics.classList.add('weather-metrics');

    // Calculate UV indicator position (0-11 scale, convert to percentage)
    const uvPosition = Math.min((weatherData.current.uvIndex / 11) * 100, 100);

    weatherMetrics.innerHTML = `
        <div class="widget uv-index">
          <div class="widget-title">
            <i class="fa-solid fa-sun"></i>
            <h2>UV INDEX</h2>
          </div>
          <div class="widget-content">
            <h3 class="value">${weatherData.current.uvIndex}</h3>
            <p class="level-description">${weatherData.current.uvDescription}</p>
            <div class="uv-meter">
              <span class="indicator" style="left: ${uvPosition}%;"></span>
            </div>
            <p class="uv-advice">${weatherData.current.uvAdvice}</p>
          </div>
        </div>
        <div class="widget wind">
          <div class="widget-title">
            <i class="fa-solid fa-wind"></i>
            <h2>WIND</h2>
          </div>
          <div class="widget-content">
            <div class="wind-info">
              <h3 class="value">${weatherData.current.wind}</h3>
              <div class="wind-description">
                <p class="unit">MPH</p>
                <p class="label">Wind</p>
              </div>
            </div>
            <hr />
            <div class="wind-info gust">
              <h3 class="value">${weatherData.current.gust}</h3>
              <div class="wind-description">
                <p class="unit">MPH</p>
                <p class="label">Gusts</p>
              </div>
            </div>
          </div>
        </div>
    `;

    return weatherMetrics;
  },

  // Temperature conversion utility
  convertTemperature(temp) {
    if (this.currentUnit === 'C') {
      return Math.round(((temp - 32) * 5) / 9);
    }
    return Math.round(temp);
  },

  // Toggle temperature unit
  toggleTemperatureUnit() {
    this.currentUnit = this.currentUnit === 'F' ? 'C' : 'F';
  },
};
