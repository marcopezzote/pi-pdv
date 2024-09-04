const dataBase = require("../../connection/connection");

const getClients = async (req, res) => {
  try {
    const query = await dataBase("clientes").returning("*");

    if (!query) {
      return res.status(404).json({ message: "Não tem clientes registrados." });
    }

    return res.json(query);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao listar os clientes.", error: error.message });
  }
};

module.exports = { getClients };
