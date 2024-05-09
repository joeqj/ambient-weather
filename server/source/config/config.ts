import dotenv from 'dotenv';

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
const MYSQL_PORT = Number(process.env.MYSQL_PORT) || 3306;
const MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'ambient-weather';
const MYSQL_USER = process.env.MYSQL_USER || 'user';
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'password';

const MYSQL = {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DATABASE,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD
};

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'http://localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3333;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT
};

const OPENWEATHER_APIKEY = process.env.OPENWEATHER_APIKEY || '';
const OPENWEATHER_LOCATION = process.env.OPENWEATHER_LOCATION || '53.809232939773125,-1.5866067767162606'; // Leeds, UK by default
const OPENWEATHER_UNITS = process.env.OPENWEATHER_LANGUAGE || 'metric';

const OPENWEATHER = {
  apiKey: OPENWEATHER_APIKEY,
  location: OPENWEATHER_LOCATION,
  units: OPENWEATHER_UNITS
};

const config = {
  mysql: MYSQL,
  server: SERVER,
  openweather: OPENWEATHER
};

export default config;
