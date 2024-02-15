export interface WeatherParsed {
  text: string;
  description: string;
  temperature: number;
  pressure: number;
  humidity: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  cloudCoverage: number;
  sunrise: number;
  sunset: number;
}
