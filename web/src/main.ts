import "./style.css";
import { fetchWeather } from "./fetch.ts";
import { loadingSvg } from "./ui/loading.ts";
import { errorMessage } from "./ui/error.ts";

window.addEventListener("DOMContentLoaded", () => {
  const notice: HTMLDivElement = document.querySelector(".notice")!;
  const playButton: HTMLButtonElement | null = notice.querySelector("button");

  if (!playButton) return;

  playButton.addEventListener("click", async () => {
    notice.innerHTML = loadingSvg();

    let data = await fetchWeather();

    if (!data) {
      notice.innerHTML = errorMessage();
      return;
    }

    const audio = await import("./audio");

    const description: String = data.description;
    const temperature: Number = Math.round(data.temperature);

    audio.initAudio(data);

    notice.innerHTML = `
      <h2>${temperature}&deg;C</h2>
      <p class="description">${description}</p>
    `;
  });

  notice.appendChild(playButton);

  document.querySelector<HTMLDivElement>("#app")!.appendChild(notice);
});
