const dataBase = require("../../connection/connection");

const getList = async (req, res) => {
  try {
    const categorias = await dataBase("categorias");

    return res.status(200).json(categorias);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro em listar categoria", error: error.message });
  }
};

module.exports = { getList };
