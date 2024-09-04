const dataBase = require("../connection/connection");
const { deleteFile } = require("../utils/storage");
const { bucketName } = require("../supabaseClient"); // Certifique-se de importar bucketName

// Middleware para verificar se o produto está vinculado a um pedido
const checkProductOrder = async (req, res, next) => {
  const { id } = req.params;

  try {
    const validateRows = await dataBase("pedido_produtos")
      .where("produto_id", id)
      .select("id");

    if (validateRows.length > 0) {
      return res.status(400).json({
        message:
          "Produto não pode ser deletado pois está vinculado a um pedido",
      });
    }

    next();
  } catch (error) {
    console.error("Erro ao verificar vinculação do produto:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// Middleware para excluir a imagem do bucket
const deleteProductImage = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await dataBase("produtos").where({ id }).first();
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    const imageUrl = product.produto_imagem;
    const imagePath = imageUrl
      ? imageUrl.split("/storage/v1/object/public/")[1]
      : null; // Extrai a chave correta

    if (imagePath) {
      try {
        console.log(
          "Tentando excluir a imagem do S3 com o seguinte caminho:",
          imagePath
        );
        await deleteFile(imagePath);
      } catch (deleteError) {
        console.error("Erro ao excluir a imagem do S3: ", deleteError);
        return res.status(500).json({
          message: "Erro ao excluir a imagem do S3",
          error: deleteError.message,
        });
      }
    }

    next();
  } catch (error) {
    console.error("Erro ao excluir imagem do produto:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

module.exports = {
  checkProductOrder,
  deleteProductImage,
};
