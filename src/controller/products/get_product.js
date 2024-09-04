const dataBase = require("../../connection/connection");

const getProducts = async (req, res) => {
  const { categoria_id } = req.query;

  try {
    let products;
    if (categoria_id) {
      const category = await dataBase("categorias")
        .where("id", categoria_id)
        .first();
      if (!category) {
        return res.status(400).json({ message: "Categoria não encontrada" });
      }
      products = await dataBase("produtos").where("categoria_id", categoria_id);
    } else {
      products = await dataBase("produtos");
    }
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao listar os produtos.", error: error.message });
  }
};

module.exports = { getProducts };
