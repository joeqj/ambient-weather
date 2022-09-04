export interface WeatherObject {
  localObservationDateTime: Date;
  weatherText: string;
  weatherIcon: number;
  hasPrecipitation: number;
  precipitationType: string|null;
  isDayTime: number;
  temperature: number;
  relativeHumidity: number;
  windDirection: string;
  windSpeed: number;
  visibility: number;
  cloudCover: number;
  precipitationPastHour: number;
  precipitationPast12Hours: number;
  temperaturePast12HoursMin: number,
  temperaturePast12HoursMax: number;
}