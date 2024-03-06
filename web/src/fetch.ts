import { Weather } from "./types/fetch";

export async function fetchWeather() {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/weather/get`);

  if (!response.ok) {
    throw new Error("Fetch to weather failed");
  }

  const json = await response.json();

  const data: Weather = json.data;

  return data;
}
