import { WeatherReport, WeatherObj } from "../types/report";

const mapResponse = (data: WeatherReport[]) => {
  const report: WeatherReport = data[0];
  const parsed: WeatherObj = {
    localObservationDateTime: report.LocalObservationDateTime,
    weatherText: report.WeatherText,
    weatherIcon: report.WeatherIcon,
    hasPrecipitation: report.HasPrecipitation,
    precipitationType: report.PrecipitationType,
    isDayTime: report.IsDayTime,
    temperature: report.Temperature.Metric.Value,
    relativeHumidity: report.RelativeHumidity,
    wind: {
      direction: report.Wind.Direction.English,
      speed: report.Wind.Speed.Metric.Value
    },
    visibility: report.Visibility.Metric.Value,
    cloudCover: report.CloudCover,
    precipitationSummary: {
      pastHour: report.PrecipitationSummary.PastHour.Metric.Value,
      past12Hours: report.PrecipitationSummary.Past12Hours.Metric.Value
    },
    temperatureSummary: {
      minimum: report.TemperatureSummary.Past12HourRange.Minimum.Metric.Value,
      maximum: report.TemperatureSummary.Past12HourRange.Maximum.Metric.Value
    }
  }

  return parsed;
};

const parseData = (data: any) => {
  const result = mapResponse(data)
}

export {
  mapResponse,
  parseData
}