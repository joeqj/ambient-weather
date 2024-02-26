import mysql from 'mysql2/promise';
import config from './config';

const params = {
  user: config.mysql.user,
  password: config.mysql.password,
  host: config.mysql.host,
  database: config.mysql.database,
  port: config.mysql.port
};

const Connect = async () => {
  return await mysql.createConnection(params);
};

const Query = async (connection: mysql.Connection, query: string) => {
  const [results] = await connection.query(query);
  return results;
};

export { Connect, Query };
