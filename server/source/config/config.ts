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
  password: MYSQL_PASSWORD,
}

const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || 3333;

const SERVER = {
  hostname: SERVER_HOSTNAME,
  port: SERVER_PORT
}

const ACCUWEATHER_APIKEY = process.env.ACCUWEATHER_APIKEY || '';
const ACCUWEATHER_LOCATION = process.env.ACCUWEATHER_LOCATION || '712327'; // Leeds, UK by default
const ACCUWEATHER_LANGUAGE = process.env.ACCUWEATHER_LANGUAGE || 'en-GB'; // English by default

const ACCUWEATHER = {
  apiKey: ACCUWEATHER_APIKEY,
  location: ACCUWEATHER_LOCATION,
  language: ACCUWEATHER_LANGUAGE
}

const config = {
  mysql: MYSQL,
  server: SERVER,
  accuweather: ACCUWEATHER
}

export default config;
