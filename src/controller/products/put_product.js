const dataBase = require("../../connection/connection");
const { validateProduct } = require("../../middleware/validation");
const { uploadFile, deleteFile } = require("../../utils/storage");

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { descricao, quantidade_estoque, valor, categoria_id } = req.body;
  let produto_imagem = req.body.produto_imagem;

  const { error } = validateProduct(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const verifyExistedProduct = await dataBase("produtos")
      .where("id", id)
      .first();

    if (!verifyExistedProduct) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const verifyExistedCategory = await dataBase("categorias")
      .where("id", categoria_id)
      .first();

    if (!verifyExistedCategory) {
      return res.status(400).json({ message: "Categoria não existente." });
    }

    if (req.file) {
      console.log("Atualizando imagem do produto...");

      // Deletar a imagem antiga se existir
      if (verifyExistedProduct.produto_imagem) {
        const oldImagePath = verifyExistedProduct.produto_imagem
          .split("/")
          .pop(); // Extrair o nome do arquivo
        console.log(
          "Tentando deletar a imagem antiga do Supabase:",
          oldImagePath
        );
        await deleteFile(oldImagePath);
      }

      // Atualizar a nova imagem
      produto_imagem = req.file.s3Location; // Certificar que a localização da nova imagem está correta
    }

    const updatedProduct = await dataBase("produtos")
      .where("id", id)
      .update({
        descricao,
        quantidade_estoque,
        valor,
        categoria_id,
        produto_imagem,
      })
      .returning("*");

    return res.status(200).json(updatedProduct[0]);
  } catch (error) {
    console.error("Erro ao atualizar o produto:", error);
    return res
      .status(500)
      .json({ message: "Erro ao atualizar o produto.", error: error.message });
  }
};

module.exports = { updateProduct };
