import "./style.css";
import { fetchWeather } from "./fetch.ts";
import { loadingSvg } from "./ui/loading.ts";
import { errorMessage } from "./ui/error.ts";

window.addEventListener("DOMContentLoaded", () => {
  const notice: HTMLDivElement = document.createElement("div");
  notice.classList.add("notice");

  const playButton: HTMLButtonElement = document.createElement("button");
  playButton.textContent = "Begin listening to the weather";

  playButton.addEventListener("click", async () => {
    notice.innerHTML = loadingSvg();

    let data = await fetchWeather();

    if (!data) {
      // Lets retry a further 2 times before erroring out
      for (let i = 1; i < 3; i++) {
        setTimeout(async () => {
          data = await fetchWeather();

          if (i == 2 && !data) {
            notice.innerHTML = errorMessage();
          }
        }, i * 2000);
      }
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
