const axios = require("axios");

const getAddressDetails = async (cep) => {
  try {
    const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
    if (response.data.erro) {
      console.error(`Erro ao buscar dados de endereço: ${response.data}`);
      return null;
    }
    return {
      adressData: {
        logradouro: response.data.logradouro,
        bairro: response.data.bairro,
        localidade: response.data.localidade,
        uf: response.data.uf,
      },
    };
  } catch (error) {
    console.error("Erro ao fazer a requisição de dados de endereço:", error);
    return { error: { message: "Erro ao buscar dados do CEP." } };
  }
};

module.exports = { getAddressDetails };
