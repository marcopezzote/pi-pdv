const dataBase = require("../../connection/connection");
const { validateProduct } = require("../../middleware/validation");

const createProduct = async (req, res) => {
  console.log("Campos do formulário:", req.body);
  console.log("Arquivo enviado:", req.file);

  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Arquivo não enviado." });
  }

  try {
    const verifyExistedCategory = await dataBase("categorias")
      .where("id", categoria_id)
      .first();

    if (!verifyExistedCategory) {
      return res.status(400).json({ message: "Categoria não existente." });
    }

    const newProduct = await dataBase("produtos")
      .insert({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem: file.s3Location,
      })
      .returning("*");

    return res.status(201).json(newProduct[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao criar produto.", error: error.message });
  }
};

module.exports = { createProduct };
