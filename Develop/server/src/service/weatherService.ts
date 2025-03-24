import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  temp: number;
  humidity: number;
  windSpeed: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, temp: number, humidity: number, windSpeed: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.temp = temp;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL?: string;
  private apiKey?: string | undefined;
  private cityName: string;

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';
    this.apiKey = process.env.WEATHER_API_KEY || '';
    this.cityName = '';
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    console.log(query);
    const response = await fetch(query);
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to retrieve location data');
    }
    return await response.json();
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    console.log(locationData);
    return {
      lat: locationData[0].lat,
      lon: locationData[0].lon,
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    console.log(locationData);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to retrieve weather data');
    }
    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    console.log(response);
    const currentWeather = response.list[0];
    return new Weather(
      this.cityName,
      currentWeather.dt_txt,
      currentWeather.weather[0].icon,
      currentWeather.weather[0].description,
      currentWeather.main.temp,
      currentWeather.main.humidity,
      currentWeather.wind.speed
  );
}

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any) {
    const forecastArray: Weather[] = [currentWeather];
    console.log(weatherData);
    for (let i = 0; i < weatherData.length; i+=8) {
      const forecast = weatherData[i];
      forecastArray.push(
        new Weather(
          this.cityName,
          forecast.dt_txt,
          forecast.weather[0].icon,
          forecast.weather[0].description,
          forecast.main.temp,
          forecast.main.humidity,
          forecast.wind.speed
        )
      );
    }
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return this.buildForecastArray(currentWeather, weatherData.list);
  }
}

export default new WeatherService();
