// weatherService.js
export const weather = {
  API_KEY: '3JE4LUDCDFC2S22SZE6Y8GU9V',
  BASE_URL:
    'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline',

  // 1. Main public method
  async getWeatherData(city) {
    try {
      const rawData = await this.fetchWeatherData(city);
      return this.transformWeatherData(rawData);
    } catch (error) {
      console.error('Weather service error:', error);
      throw error;
    }
  },

  // 2. Pure API communication
  async fetchWeatherData(city) {
    const url = `${this.BASE_URL}/${encodeURIComponent(city)}?key=${this.API_KEY}&include=hours`;
    const response = await fetch(url, { method: 'GET', mode: 'cors' });

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }

    return await response.json();
  },

  // 3. Data transformation
  transformWeatherData(data) {
    const now = new Date();
    const currentHour = now.getHours();

    return {
      current: this.getCurrentWeather(data, currentHour),
      hourly: this.getHourlyForecast(data, currentHour),
      daily: this.getDailyForecast(data),
    };
  },

  // 4. Current weather extraction
  getCurrentWeather(data, currentHour) {
    const todayHours = data.days[0].hours;
    const current = todayHours[currentHour];
    const todayData = data.days[0];

    return {
      city: data.resolvedAddress,
      temp: current.temp.toFixed(0),
      condition: current.conditions,
      feelsLike: current.feelslike,
      precip: current.precip,
      expectedPrecip: data.days[1].hours[currentHour].precip,
      // Better description handling with fallbacks
      description:
        current.description ||
        todayData.description ||
        current.conditions ||
        'Current weather conditions',
      visibility: current.visibility,
      humidity: Math.round(current.humidity),
      dew: current.dew,
      uvIndex: current.uvindex,
      uvDescription: this.getUvDescription(current.uvindex),
      uvAdvice: this.getUvAdvice(data.days[0].hours, current.uvindex),
      wind: current.windspeed,
      gust: current.windgust,
    };
  },

  // UV Index Description Helper
  getUvDescription(uvIndex) {
    if (uvIndex < 3) return 'Low';
    if (uvIndex < 6) return 'Moderate';
    if (uvIndex < 8) return 'High';
    if (uvIndex < 11) return 'Very High';
    return 'Extreme';
  },

  // UV Safety Advice Generator
  getUvAdvice(hours, currentUv) {
    const uvCategories = {
      low: { max: 2, advice: 'Safe to be outside without protection' },
      moderate: { max: 5, advice: 'Stay in shade near midday' },
      high: { max: 7, advice: 'Use sunscreen SPF 30+' },
      veryHigh: {
        max: 10,
        advice: 'Use sunscreen SPF 50+ and wear protective clothing',
      },
      extreme: { max: Infinity, advice: 'Avoid sun exposure between 10am-4pm' },
    };

    // Get current category
    let currentCategory = 'low';
    for (const [category, { max }] of Object.entries(uvCategories)) {
      if (currentUv <= max) {
        currentCategory = category;
        break;
      }
    }

    // For anything above low, find when it becomes safe again
    if (currentCategory !== 'low') {
      const safeTime = this.findNextSafeTime(hours, currentUv);
      if (safeTime) {
        uvCategories[currentCategory].advice += ` until ${safeTime}`;
      }
    }

    return uvCategories[currentCategory].advice;
  },

  // Find when UV drops to safe levels (below 3)
  findNextSafeTime(hours, currentUv) {
    if (currentUv < 3) return null; // Already safe

    // Find the next hour when UV drops below 3
    const safeHour = hours.find((h) => h.uvindex < 3);

    if (safeHour) {
      const timeString = safeHour.datetime.slice(0, 5); // "HH:MM" format
      return timeString;
    }

    return 'sunset'; // Default if no safe time found in daytime
  },

  // 5. Hourly forecast extraction
  getHourlyForecast(data, currentHour) {
    const todayHours = data.days[0].hours;
    const tomorrowHours = data.days[1]?.hours || [];

    return [...todayHours.slice(currentHour), ...tomorrowHours]
      .slice(0, 10)
      .map((h, index) => ({
        time: index === 0 ? 'Now' : h.datetime.slice(0, 5),
        temp: h.temp.toFixed(0),
        condition: h.conditions,
        iconClass: this.getIconClass(h.conditions),
      }));
  },

  // 6. Daily forecast extraction
  getDailyForecast(data) {
    return data.days.slice(0, 10).map((day) => ({
      date: this.formatDate(day.datetime),
      day: this.getDayName(day.datetime),
      temp: day.temp.toFixed(0),
      condition: day.conditions,
      iconClass: this.getIconClass(day.conditions),
    }));
  },

  // 7. Helper functions
  getIconClass(condition) {
    const lower = condition.toLowerCase();
    if (lower.includes('clear')) return 'fa-regular fa-sun';
    if (lower.includes('cloud') && !lower.includes('overcast'))
      return 'fa-solid fa-cloud-sun';
    if (lower.includes('overcast')) return 'fa-solid fa-cloud';
    if (lower.includes('rain')) return 'fa-solid fa-cloud-showers-heavy';
    if (lower.includes('thunder')) return 'fa-solid fa-cloud-bolt';
    if (lower.includes('snow')) return 'fa-regular fa-snowflake';
    if (lower.includes('fog')) return 'fa-solid fa-smog';
    if (lower.includes('wind')) return 'fa-solid fa-wind';
    return 'fa-solid fa-question';
  },

  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB').slice(0, 5); // DD/MM/YYYY
  },

  getDayName(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
  },
};
