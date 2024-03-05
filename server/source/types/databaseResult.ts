export interface DatabaseResult {
  id: number;
  created_at: string;
  text: string;
  description: string;
  temperature: number;
  pressure: number;
  humidity: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  rain: number;
  cloudCoverage: number;
  sunrise: string;
  sunset: string;
  timezone: string;
}
