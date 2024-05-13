export interface DatabaseResult {
  id: number | null;
  created_at: string;
  text: string;
  description: string;
  temperature: number;
  pressure: number;
  humidity: number;
  visibility: number;
  windSpeed: number;
  windDirection: string;
  rain: number;
  cloudCoverage: number;
  sunrise: string;
  sunset: string;
  timezone: string;
}
