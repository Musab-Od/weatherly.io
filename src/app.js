import './CSS/normalize.css';
import './CSS/all.min.css';
import './CSS/style.css';
import { ui } from './ui.js';
import { search } from './search.js';
import { weather } from './weatherService.js';

// Import background images
import sunnyBg from './assets/sunny.jpg';
import cloudyBg from './assets/cloudy.jpg';
import rainyBg from './assets/rainy.jpg';
import snowyBg from './assets/snowy.jpg';
import thunderBg from './assets/thunder.jpg';
import defaultBg from './assets/background-1.jpg';

class WeatherApp {
  constructor() {
    this.currentWeatherData = null;
    this.init();
  }

  init() {
    // Start with search screen
    this.showSearchScreen();
  }

  showSearchScreen() {
    // Reset background to default
    this.setDefaultBackground();

    ui.clearUI();
    ui.renderSearchScreen();

    // Initialize search functionality
    search.init(this.handleCitySearch.bind(this));
  }

  async handleCitySearch(city, isInitialSearch = true) {
    try {
      if (isInitialSearch) {
        // Show loading screen for initial search
        ui.showLoadingScreen();
      } else {
        // Just log for page search
        console.log(`Searching for weather in ${city}...`);
      }

      // Fetch weather data
      const weatherData = await weather.getWeatherData(city);
      this.currentWeatherData = weatherData;

      // Set background based on weather condition
      this.setWeatherBackground(weatherData.current.condition);

      // Render the main weather page
      this.showWeatherPage();
    } catch (error) {
      console.error('Failed to fetch weather data:', error);

      if (isInitialSearch) {
        // Show error screen for initial search
        ui.showErrorScreen(error.message, () => this.showSearchScreen());
      } else {
        // Just log for page search
        console.log('Failed to update weather data');
      }
    }
  }

  setWeatherBackground(condition) {
    const body = document.body;
    const conditionLower = condition.toLowerCase();

    let backgroundImage = '';

    if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
      backgroundImage = `url("${sunnyBg}")`;
    } else if (
      conditionLower.includes('cloud') ||
      conditionLower.includes('overcast')
    ) {
      backgroundImage = `url("${cloudyBg}")`;
    } else if (conditionLower.includes('rain')) {
      backgroundImage = `url("${rainyBg}")`;
    } else if (conditionLower.includes('snow')) {
      backgroundImage = `url("${snowyBg}")`;
    } else if (
      conditionLower.includes('thunder') ||
      conditionLower.includes('storm')
    ) {
      backgroundImage = `url("${thunderBg}")`;
    } else {
      backgroundImage = `url("${defaultBg}")`;
    }

    body.style.backgroundImage = backgroundImage;
  }

  setDefaultBackground() {
    document.body.style.backgroundImage = `url("${defaultBg}")`;
  }

  showWeatherPage() {
    if (!this.currentWeatherData) {
      console.error('No weather data available');
      return;
    }

    ui.clearUI();
    ui.renderPage(this.currentWeatherData);

    // Set up search functionality on the main page
    this.setupMainPageSearch();

    // Set up temperature toggle functionality
    this.setupTemperatureToggle();
  }

  setupMainPageSearch() {
    const searchInput = document.querySelector('#citySearch');
    const searchIcon = document.querySelector(
      '.search-container .fa-magnifying-glass'
    );

    if (searchInput && searchIcon) {
      const handleSearch = () => {
        const city = searchInput.value.trim();
        if (city) {
          this.handleCitySearch(city, false); // false = not initial search
        }
      };

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      });

      searchIcon.addEventListener('click', handleSearch);
    }
  }

  setupTemperatureToggle() {
    const tempToggle = document.querySelector('#tempToggle');

    if (tempToggle) {
      tempToggle.addEventListener('click', () => {
        // Toggle the unit
        ui.toggleTemperatureUnit();

        // Update button text
        tempToggle.textContent = `°${ui.currentUnit}`;

        // Re-render the weather page with new units
        this.showWeatherPage();
      });
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WeatherApp();
});
