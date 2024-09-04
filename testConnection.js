require("dotenv").config();
const knex = require("knex");

const dataBase = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false },
  },
});

dataBase
  .raw("SELECT 1")
  .then(() => {
    console.log("Conexão bem-sucedida!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Erro na conexão:", err);
    process.exit(1);
  });
