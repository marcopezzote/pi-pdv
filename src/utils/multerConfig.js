// utils/multerConfig.js
const multer = require("multer");
const path = require("path");

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Diretório onde os arquivos serão armazenados
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nome do arquivo armazenado
  },
});

// Filtro para aceitar apenas determinados tipos de arquivos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Tipo de arquivo não permitido");
    error.status = 400;
    return cb(error, false);
  }
  cb(null, true);
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limite de 5MB
  },
});

module.exports = upload;
