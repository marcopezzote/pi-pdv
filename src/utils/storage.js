const fs = require("fs");
const path = require("path");
const upload = require("./multerConfig");
const { client, bucketName } = require("../supabaseClient");
const {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} = require("@aws-sdk/client-s3");

const uploadFile = (req, res, next) => {
  const uploadSingle = upload.single("produto_imagem");
  uploadSingle(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    console.log("Arquivo recebido no middleware multer:", req.file);

    if (!req.file) {
      // Se não houver arquivo, continue sem tentar fazer o upload
      req.file = { s3Location: null }; // Define um valor padrão para s3Location
      return next();
    }

    try {
      const fileContent = fs.readFileSync(req.file.path);
      const params = {
        Bucket: bucketName,
        Key: req.file.filename,
        Body: fileContent,
        ContentType: req.file.mimetype,
      };

      const command = new PutObjectCommand(params);
      await client.send(command);

      // Construir a URL corretamente
      const baseUrl = process.env.SUPABASE_URL.replace(
        /\/storage\/v1\/s3$/,
        ""
      ); // Remove a parte final incorreta da URL
      req.file.s3Location = `${baseUrl}/storage/v1/object/public/${bucketName}/${req.file.filename}`;
      fs.unlinkSync(req.file.path);

      next();
    } catch (s3Err) {
      console.error(s3Err);
      return res.status(500).json({
        message: "Erro ao enviar arquivo para o Supabase",
        error: s3Err.message,
      });
    }
  });
};

const listFiles = async () => {
  const params = {
    Bucket: bucketName,
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await client.send(command);
    console.log("Arquivos no bucket:", data.Contents);
  } catch (err) {
    console.error("Erro ao listar arquivos no S3:", err);
  }
};

// Função de exclusão de arquivo
const deleteFile = async (filePath) => {
  console.log("Tentando deletar o arquivo do Supabase:", filePath);
  console.log("Bucket name:", bucketName);

  // Remover prefixo 'produto_imagem/' da chave
  const keyWithoutPrefix = filePath.replace(/^produto_imagem\//, "");

  const params = {
    Bucket: bucketName,
    Key: keyWithoutPrefix,
  };

  console.log("Params being sent to S3:", params);

  // Listar arquivos para verificar se o arquivo está presente
  await listFiles();

  const headObject = new HeadObjectCommand(params);

  try {
    // Verifique se o arquivo existe no S3
    await client.send(headObject);
    console.log("Arquivo encontrado no S3, prosseguindo com a deleção...");

    const command = new DeleteObjectCommand(params);
    await client.send(command);
    console.log("Arquivo deletado com sucesso do Supabase:", keyWithoutPrefix);
  } catch (err) {
    if (err.Code === "NotFound" || err.Code === "NoSuchKey") {
      console.error(
        "Erro: O arquivo especificado não foi encontrado no S3. Nenhuma ação necessária."
      );
    } else {
      console.error("Erro ao excluir a imagem do S3:", err);
      throw err;
    }
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
