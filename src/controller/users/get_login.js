const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dataBase = require("../../connection/connection");

const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Preencha todos os campos" });
  }

  try {
    const user = await dataBase("usuarios").where("email", email).first();

    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const comparePassword = await bcrypt.compare(senha, user.senha);
    if (!comparePassword) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    const { senha: _, ...restUser } = user;

    return res.json({ message: "Login bem-sucedido", token, user: restUser });
  } catch (error) {
    return res.status(500).json({
      message: "Algo inesperado aconteceu ao realizar o login do usuário.",
      error: error.message,
    });
  }
};

module.exports = loginUser;
