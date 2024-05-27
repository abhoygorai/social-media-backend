const pg = require("pg");

const { Client } = pg;
const dbUsername = process.env.DATABASE_USERNAME;
const dbPassword = process.env.DATABASE_PASSWORD;
const dbName = process.env.DATABASE_NAME;

const client = new Client(
  "postgres://" + dbUsername + ":" + dbPassword + "@localhost:5432/" + dbName
);

exports.connectToDatabase = async function () {
  await client
    .connect()
    .then(() => console.log("Connected to PostgreSQL database"))
    .catch((err) => console.error("Connection error", err.stack));
    
  return client;
};

// exports.takeClient = async function () {
//   return client;
// };
