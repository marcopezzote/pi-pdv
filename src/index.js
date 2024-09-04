require("dotenv").config();
const express = require("express");
const { router } = require("./routes/router");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(require("../swagger.json"))
);

// Log para verificar se a solicitação está chegando ao servidor
app.use((req, res, next) => {
  console.log(`Recebida solicitação ${req.method} para ${req.url}`);
  next();
});

app.use(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
