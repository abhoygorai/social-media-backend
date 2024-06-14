const pg = require("pg");

const { Client, Pool } = pg;
const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbName = process.env.DATABASE_NAME;

const pool = new Pool({
  connectionString:
    "postgres://" + dbUsername + ":" + dbPassword + "@localhost:5432/" + dbName,
});

exports.connectToDatabase = async function () {
  await pool
    .connect()
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch((err) => console.error("Connection error", err.stack));

  return pool;
};

// exports.takeClient = async function () {
//   return client;
// };
