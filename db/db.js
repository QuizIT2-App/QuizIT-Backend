require('dotenv').config();
const mysql = require('mysql2');
const env = process.env;

const db = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
});

module.exports = db;