import dotenv from 'dotenv';
dotenv.config();
// DONE: Define a class for the Weather object
class Weather {
    constructor(city, date, temperature, humidity, windSpeed, weatherIcon, weatherDescription) {
        this.city = city;
        this.date = date;
        this.tempF = temperature;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
        this.icon = weatherIcon;
        this.weatherDescription = weatherDescription;
    }
}
;
// TODO: Complete the WeatherService class
class WeatherService {
    constructor() {
        this.cityName = '';
        this.baseURL = process.env.API_BASE_URL || '';
        this.apiKey = process.env.API_KEY || '';
    }
    // TODO: Create fetchLocationData method
    async fetchLocationData(query) {
        const response = await fetch(query);
        const results = await response.json();
        return results[0];
    }
    // : Create destructureLocationData method
    destructureLocationData(locationData) {
        return {
            lat: locationData.lat,
            lon: locationData.lon,
        };
    }
    // TODO: Create buildGeocodeQuery method
    buildGeocodeQuery() {
        const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
        return geocodeQuery;
    }
    // TODO: Create buildWeatherQuery method
    buildWeatherQuery(coordinates) {
        const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
        return weatherQuery;
    }
    // TODO: Create fetchAndDestructureLocationData method
    async fetchAndDestructureLocationData() {
        const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
        const coordinates = this.destructureLocationData(locationData);
        return coordinates;
        //call destructure the locationData
        //return destructured locationData as coordinates
    }
    // TODO: Create fetchWeatherData method
    async fetchWeatherData(coordinates) {
        console.log('Here is the query', this.buildWeatherQuery(coordinates));
        const response = await fetch(this.buildWeatherQuery(coordinates));
        const weatherData = await response.json();
        // const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
        console.log('Here is weather data', weatherData);
        const forecastArray = this.buildForecastArray(weatherData.list);
        return forecastArray;
        //pass in coordinates
        //return the weather data
    }
    convertKtoF(kelvin) {
        return Math.round((kelvin - 273.15) * 9 / 5 + 32);
    }
    parseCurrentWeather(response) {
        // Parse the current weather data from the response
        // Return a Weather object
        const weatherParsed = new Weather(this.cityName, response.dt_txt, this.convertKtoF(response.main.temp), response.main.humidity, response.wind.speed, response.weather[0].icon, response.weather[0].description);
        return weatherParsed;
    }
    // TODO: Complete buildForecastArray method
    buildForecastArray(weatherData) {
        const fiveDayForecast = [];
        for (let i = 0; i < weatherData.length; i = i + 8) {
            const parsedWeather = this.parseCurrentWeather(weatherData[i]);
            fiveDayForecast.push(parsedWeather);
        }
        return fiveDayForecast;
    }
    // Add the current weather to the forecast arrayfor
    // Build an array of Weather objects for the forecast
    // Return the array of Weather objects
    // TODO: Complete getWeatherForCity method
    async getWeatherForCity(city) {
        this.cityName = city;
        const cityCoordinates = await this.fetchAndDestructureLocationData();
        const results = await this.fetchWeatherData(cityCoordinates);
        return results;
    }
}
;
export default new WeatherService();
