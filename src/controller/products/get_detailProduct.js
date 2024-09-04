const dataBase = require("../../connection/connection");

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await dataBase("produtos").where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao listar os produtos.", error: error.message });
  }
};

module.exports = { getProductById };
