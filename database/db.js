require("dotenv").config();
const Promise = require("bluebird");

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  socketpath: process.env.DB_SOCKETPATH
});

const db = Promise.promisifyAll(connection, { multiArgs: true});

db.connectAsync()
  .then(() => console.log(`Connected to MySQL as id: ${db.threadId}`))
  .catch((err) => console.log(err));

module.exports = db;