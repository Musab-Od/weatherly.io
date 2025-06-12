# Weatherly App 🌤️

A sleek, modular JavaScript weather application that allows users to search for any city and instantly view detailed weather information. The app uses modern web development best practices with a clean separation of concerns across modules and a user-friendly interface.

## Features

- 🔍 **City-based search**: Enter any city name to get the latest weather.
- ☁️ **Current conditions**: See temperature, weather description, and more.
- 📆 **Hourly & 10-day forecast**: Scrollable forecast data per hour and per day.
- 🌡️ **Feels like, UV index, humidity**: Additional weather insights.
- 💡 **Loading state**: Smooth loading indicator while fetching data.
- 🧩 **Modular codebase**: Separation between UI, search logic, and weather data handling.
- 🖥️ **Built with Webpack**: Production-ready build system using Babel, ESLint, and Prettier.

## Project Structure

src/
├── app.js # Main entry point
├── ui.js # Renders UI components
├── search.js # Handles search input & triggers
├── weatherService.js # Fetches & processes weather data
└── CSS/ # CSS styles

## Deployment

- `main` branch contains source code.
- `gh-pages` branch serves the built app via GitHub Pages.

🔗 [**Live Demo**](https://musab-od.github.io/weatherly.io/)

Built with ❤️ using vanilla JavaScript, Webpack, and clean code practices.
