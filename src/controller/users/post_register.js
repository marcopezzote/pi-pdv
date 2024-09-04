const bcrypt = require("bcrypt");
const dataBase = require("../../connection/connection");
const jwt = require("jsonwebtoken");
const { validateUser } = require("../../middleware/validation");

const register = async (req, res) => {
  const { nome, email, senha } = req.body;
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const verifyAlreadyExistUser = await dataBase("usuarios")
      .where("email", email)
      .first();

    if (verifyAlreadyExistUser) {
      return res.status(400).json({ message: "Email já existente." });
    }
    const crypt = await bcrypt.hash(senha, 10);
    const newUser = await dataBase("usuarios")
      .insert({ nome, email, senha: crypt })
      .returning("*");
    const token = jwt.sign({ id: newUser[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({
      message: "Algo inesperado aconteceu com o cadastro do usuario",
      error: error.message,
    });
  }
};
module.exports = register;
