import { WeatherResponse } from "../types/weatherResponse";
import { WeatherObject } from "../types/weatherObject";

const mapResponse = (data: WeatherResponse[]) => {
  const report: WeatherResponse = data[0];
  const parsed: WeatherObject = {
    localObservationDateTime: report.LocalObservationDateTime,
    weatherText: report.WeatherText,
    weatherIcon: report.WeatherIcon,
    hasPrecipitation: report.HasPrecipitation ? 1 : 0,
    precipitationType: report.PrecipitationType,
    isDayTime: report.IsDayTime ? 1 : 0,
    temperature: report.Temperature.Metric.Value,
    relativeHumidity: report.RelativeHumidity,
    windDirection: report.Wind.Direction.English,
    windSpeed: report.Wind.Speed.Metric.Value,
    visibility: report.Visibility.Metric.Value,
    cloudCover: report.CloudCover,
    precipitationPastHour: report.PrecipitationSummary.PastHour.Metric.Value,
    precipitationPast12Hours: report.PrecipitationSummary.Past12Hours.Metric.Value,
    temperaturePast12HoursMin: report.TemperatureSummary.Past12HourRange.Minimum.Metric.Value,
    temperaturePast12HoursMax: report.TemperatureSummary.Past12HourRange.Maximum.Metric.Value
  }

  return parsed;
};

export {
  mapResponse
}