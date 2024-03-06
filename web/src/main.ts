import "./style.css";
import { fetchWeather } from "./fetch.ts";

window.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchWeather();

  const audio = await import("./audio");

  const description: String = data.description;
  const temperature: Number = Math.round(data.temperature);

  const notice: HTMLDivElement = document.createElement("div");
  notice.classList.add("notice");
  notice.innerHTML = `
    <h2>${temperature}&deg;C</h2>
    <p>${description}</p>
  `;

  const playButton: HTMLButtonElement = document.createElement("button");
  playButton.textContent = "Play Audio";

  playButton.addEventListener("click", () => {
    audio.initAudio(data);
    playButton.remove();
  });

  notice.appendChild(playButton);

  document.querySelector<HTMLDivElement>("#app")!.appendChild(notice);
});
