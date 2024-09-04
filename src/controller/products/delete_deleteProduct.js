const dataBase = require("../../connection/connection");

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await dataBase("produtos").where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    await dataBase("produtos").where({ id }).delete();

    return res.status(200).json({ message: "Produto deletado com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir produto: ", error);
    return res
      .status(500)
      .json({ message: "Erro ao excluir produto.", error: error.message });
  }
};

module.exports = { deleteProduct };
