import dotenv from 'dotenv';
dotenv.config();

// DONE: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// DONE: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  weatherDescription: string;

  constructor(city: string, date: string, temperature: number, humidity: number, windSpeed: number, weatherIcon: string, weatherDescription: string) {
    this.city = city;
    this.date = date;
    this.tempF = temperature;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = weatherIcon;
    this.weatherDescription = weatherDescription;
  }
  };
// TODO: Complete the WeatherService class
class WeatherService {
  // DONE: Define the baseURL, API key, and city name properties
  baseURL?: string;
  apiKey?: string;
  private cityName = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  // TODO: Create fetchLocationData method

  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    const results = await response.json();
    return results[0];
  }
  // : Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geocodeQuery = `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`
    return geocodeQuery
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const weatherQuery = `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}`;
    return weatherQuery;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    const coordinates = this.destructureLocationData(locationData);
    return coordinates;
    //call destructure the locationData
    //return destructured locationData as coordinates
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    console.log('Here is the query', this.buildWeatherQuery(coordinates));
    const response = await fetch(this.buildWeatherQuery(coordinates));
    const weatherData = await response.json();
    // const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
    console.log('Here is weather data', weatherData,);
    const forecastArray = this.buildForecastArray(weatherData.list);
    return forecastArray;
    //pass in coordinates
    //return the weather data
  }
  private convertKtoF(kelvin: number): number {
    return Math.round((kelvin - 273.15) * 9/5 + 32);
  }
  private parseCurrentWeather(response: any) {
    // Parse the current weather data from the response
    // Return a Weather object
      const weatherParsed = new Weather(
        this.cityName,
        response.dt_txt,
        this.convertKtoF(response.main.temp),
        response.main.humidity,
        response.wind.speed,
        response.weather[0].icon,
        response.weather[0].description
      );
      return weatherParsed;
    }
  
  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]) {
    const fiveDayForecast: Weather[] = [];
      for (let i = 0; i < weatherData.length; i=i+8) {
        const parsedWeather = this.parseCurrentWeather(weatherData[i]);
        fiveDayForecast.push(parsedWeather)
        }
        return fiveDayForecast;
    }
    // Add the current weather to the forecast arrayfor
    // Build an array of Weather objects for the forecast
    // Return the array of Weather objects

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const cityCoordinates = await this.fetchAndDestructureLocationData();
    const results = await this.fetchWeatherData(cityCoordinates);
    return results;
  }

};
export default new WeatherService();