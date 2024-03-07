import { Weather } from "./types/fetch";

export async function fetchWeather() {
  let response = await fetch(`${import.meta.env.VITE_API_URL}/weather/get`);

  if (!response.ok) {
    // Retry 2 times before throwing error
    for (let i = 0; i < 2; i++) {
      const retryResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/weather/get`
      );

      if (retryResponse.ok) {
        response = retryResponse;
      } else if (i === 2) {
        throw new Error("Failed to fetch weather data");
      }
    }
  }

  const json = await response.json();

  const data: Weather = json.data;

  return data;
}
