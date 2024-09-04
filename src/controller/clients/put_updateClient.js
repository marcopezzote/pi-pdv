const dataBase = require("../../connection/connection");
const { validateClient } = require("../../middleware/validation");
const { getAddressDetails } = require("../../utils/address_handler_api");

const updateClient = async (req, res) => {
  const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } =
    req.body;
  const { id } = req.params;
  const { error } = validateClient(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Erro ao atualizar o cliente.", error: error.message });
  }

  try {
    const verifyAlreadyExistentClient = await dataBase("clientes")
      .where({ id })
      .first();
    if (!verifyAlreadyExistentClient) {
      return res.status(404).json({ message: "Cliente não encontrado." });
    }

    const verifyAlreadyExistentClientCpf = await dataBase("clientes")
      .where({ cpf })
      .andWhere("id", "!=", id)
      .first();
    if (verifyAlreadyExistentClientCpf) {
      return res.status(404).json({ message: "Cpf já existente." });
    }

    const verifyAlreadyExistentClientEmail = await dataBase("clientes")
      .where("email", email)
      .andWhere("id", "!=", id)
      .first();
    if (verifyAlreadyExistentClientEmail) {
      return res.status(404).json({ message: "Email já existente." });
    }

    // Buscar dados de endereço caso o CEP seja fornecido
    let addressData = {};
    if (cep) {
      const addressResult = await getAddressDetails(cep);
      if (!addressResult || !addressResult.adressData) {
        return res.status(400).json({
          message: "Erro ao buscar dados de endereço.",
          error: "Dados de endereço não encontrados.",
        });
      }
      addressData = addressResult.adressData;
    }

    const updatedClient = await dataBase("clientes")
      .where({ id })
      .update({
        nome,
        email,
        cpf,
        cep,
        rua: addressData.logradouro || rua,
        numero,
        bairro: addressData.bairro || bairro,
        cidade: addressData.localidade || cidade,
        estado: addressData.uf || estado,
      })
      .returning("*");

    return res.status(200).json(updatedClient[0]);
  } catch (error) {
    console.error("Erro ao atualizar o cliente:", error);
    return res.status(500).json({
      message: "Algo inesperado aconteceu ao atualizar o cadastro.",
      error: error.message,
    });
  }
};

module.exports = { updateClient };
