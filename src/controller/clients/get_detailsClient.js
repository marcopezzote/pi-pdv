const dataBase = require("../../connection/connection");

const detailsClient = async (req, res) => {
  const { id } = req.params;

  try {
    const client = await dataBase("clientes").where("id", id).first();

    if (!client) {
      return res.status(404).json({ mensage: "Cliente não encontrado" });
    }

    return res.status(200).json(client);
  } catch (error) {
    return res.status(500).json("Erro no servidor:", error.message);
  }
};

module.exports = { detailsClient };
