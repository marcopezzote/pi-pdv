const dataBase = require("../../connection/connection");
const { validateClient } = require("../../middleware/validation");
const { getAddressDetails } = require("../../utils/address_handler_api");

const registerClient = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;
  const { error } = validateClient(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Erro ao registrar o cliente.", error: error.message });
  }
  try {
    const verifyAlreadyExistentClientCpf = await dataBase("clientes")
      .where("cpf", cpf)
      .first();
    if (verifyAlreadyExistentClientCpf) {
      return res.status(404).json({ message: "Cpf já existente." });
    }
    const verifyAlreadyExistentClientEmail = await dataBase("clientes")
      .where("email", email)
      .first();
    if (verifyAlreadyExistentClientEmail) {
      return res.status(404).json({ message: "Email já existente." });
    }

    const adressResult = await getAddressDetails(cep);

    if (!adressResult || !adressResult.adressData) {
      return res.status(400).json({
        message: "Erro ao buscar dados de endereço.",
        error: "Dados de endereço não encontrados.",
      });
    }
    const { adressData } = adressResult;

    const newClient = await dataBase("clientes")
      .insert({
        nome,
        email,
        cpf,
        cep,
        rua: adressData.logradouro || rua,
        numero,
        bairro: adressData.bairro || bairro,
        cidade: adressData.localidade || cidade,
        estado: adressData.uf || estado,
      })
      .returning("*");

    return res.status(201).json(newClient[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Algo inesperado aconteceu com o cadastro.",
      error: error.message,
    });
  }
};

module.exports = { registerClient };
