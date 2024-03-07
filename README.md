# Ambient Weather

Turning weather into ambient soundscapes 🌤️ 🌧️ ❄️

Built with Nodejs and Vite.

## System Requirements

- Node v20.10.0
- Mariadb v10.3

## Getting Started

To create a database container use docker in the project root:

```bash
docker-compose up -d
```

To start the server:

```bash
cd server
npm install
npm start
```

You will need to create an account on [OpenWeather](https://openweathermap.org/api) and create an API key to add to our `.env` file in the server directory:

```env
OPENWEATHER_APIKEY=<your_api_key>
```

You can also add database connection credentials in here. Appropriate fallbacks have been declared in the server's `config.ts` file that will work with the default docker configuration.

You will then be able to visit [http://localhost:3333/weather/get](http://localhost:3333/weather/get) in your browser to fetch the latest record from the database

Once setup start the front-end:

```bash
cd web
npm install
npm run dev
```

## Todo

### Server

- [x] Fetch weather data for Leeds, UK and store in our database
- [x] Scheduled cron job to store data on the hour every hour
- [ ] Store data for the hour in global JS object so we don't need to query the database on every request
- [ ] Create GitHub action to deploy main branch to hosting via SSH that will also restart application
- [ ] Write some unit tests with Jest
- [ ] Add all capital cities in the world
- [ ] Drop scheduled cron job to 4 times a day

### Front-end

- [x] Build out initial front-end interface and tonejs intergration
- [ ] Test out all possible weather states and create presets for tonejs
- [ ] Incorporate more of the data available to influence sound
- [ ] Info section / submissions
- [ ] Flesh out UI
- [ ] Background gradients based on weather and day/night cycle
- [ ] Convert build to a PWA
- [ ] Finalise design and logo
