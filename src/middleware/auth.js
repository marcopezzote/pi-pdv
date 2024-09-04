require("dotenv").config();

const jwt = require("jsonwebtoken");
const knex = require("../connection/connection");

const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      message:
        "Não autorizado. Para acessar esse recurso, um token de autenticação válido deve ser enviado.",
    });
  }

  try {
    const token = authorization.split(" ")[1];
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const verifyUser = await knex("usuarios").where("id", id).first();

    if (!verifyUser) {
      return res.status(401).json({
        message:
          "Não autorizado. Para acessar esse recurso, um token de autenticação válido deve ser enviado.",
      });
    }
    const { senha: _, ...restUser } = verifyUser;
    req.user = restUser;

    next();
  } catch (error) {
    return res.status(401).json({
      message:
        "Não autorizado. Para acessar esse recurso, um token de autenticação válido deve ser enviado.",
      error: error.message,
    });
  }
};

module.exports = authenticateUser;
