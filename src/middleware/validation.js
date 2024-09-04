const joi = require("joi");
//const cpf = require("cpf-check");
const { cpf } = require('cpf-cnpj-validator')

const validateUser = (data) => {
  const schema = joi.object({
    nome: joi.string().min(3).required(),
    email: joi.string().email().required(),
    senha: joi.string().min(6).required(),
  });

  return schema.validate(data);
};

const validateClient = (data) => {
  const schema = joi.object({
    nome: joi.string().min(3).required(),
    email: joi.string().email().required(),
    cpf: joi.string()
      .required()
      .custom((value, helpers) => {
        if (!cpf.isValid(value)) {
          return helpers.message("CPF inválido.");
        }
        return value;
      }, 'CPF validation'),
    cep: joi.string().allow(''),
    rua: joi.string().allow(''),
    numero: joi.string().allow(''),
    bairro: joi.string().allow(''),
    cidade: joi.string().allow(''),
    estado: joi.string().allow(''),
  });
 
  return schema.validate(data);
};

const validateProduct = (data) => {
  const schema = joi.object({
    descricao: joi.string().required(),
    quantidade_estoque: joi.number().integer().min(0).required(),
    valor: joi.number().precision(2).min(0).required(),
    categoria_id: joi.number().integer().required(),
  });

  return schema.validate(data);
};

module.exports = { validateUser, validateProduct, validateClient };
