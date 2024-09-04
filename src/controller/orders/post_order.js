const { template } = require("handlebars");
const dataBase = require("../../connection/connection");
const nodemailer = require("nodemailer");
const { text } = require("stream/consumers");

const registerOrder = async (req, res) => {
  const { cliente_id, observacao, pedido_produtos } = req.body;
  let valor_total = 0;
  if (
    !cliente_id ||
    !pedido_produtos ||
    !Array.isArray(pedido_produtos) ||
    pedido_produtos.length === 0
  ) {
    return res.status(400).json("Todos os campos são obrigatórios");
  }

  try {
    const client = await dataBase("clientes").where({ id: cliente_id }).first();
    if (!client) {
      return res.status(404).json("Cliente não encontrado");
    }

    for (const item of pedido_produtos) {
      const produto = await dataBase("produtos")
        .where({ id: item.produto_id })
        .first();
      if (!produto) {
        return res.status(404).json("Produto com id não encontrado");
      }
      if (produto.quantidade_estoque < item.quantidade_produto) {
        return res.status(400).json({ message: "Produto sem estoque" });
      }
    }

    await dataBase.transaction(async (trx) => {
      const [pedido] = await trx("pedidos")
        .insert({
          cliente_id,
          observacao,
          valor_total: 0,
        })
        .returning("*");

      let totalOrderValue = 0;

      for (const item of pedido_produtos) {
        const produto = await trx("produtos")
          .where({ id: item.produto_id })
          .first();
        const valor_produto = produto.valor * item.quantidade_produto;

        totalOrderValue += valor_produto;

        await trx("pedido_produtos").insert({
          pedido_id: pedido.id,
          produto_id: item.produto_id,
          quantidade_produto: item.quantidade_produto,
          valor_produto,
        });

        await trx("produtos")
          .where({ id: item.produto_id })
          .update({
            quantidade_estoque:
              produto.quantidade_estoque - item.quantidade_produto,
          });
      }
      await trx("pedidos").where({ id: pedido.id }).update({
        valor_total: totalOrderValue,
      });

      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      const mailOptions = {
        from: process.env.EMAIL_ADMIN,
        to: client.email,
        subject: "Confirmação de pedido.",
        text: `Seu pedido foi efetuado com sucesso! Número do pedido: ${pedido.id}.`,
      };
      await transporter.sendMail(mailOptions);

      res.status(201).json({ message: "Pedido registrado com sucesso" });
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao registrar o pedido", error: error.message });
  }
};

module.exports = registerOrder;
