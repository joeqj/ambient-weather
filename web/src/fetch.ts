import { Weather } from "./types/fetch";

export async function fetchWeather() {
  try {
    let response = await fetch(`${import.meta.env.VITE_API_URL}/weather/get`);

    const data: Weather = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}
