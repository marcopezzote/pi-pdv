const { error } = require("console");
const dataBase = require("../../connection/connection");

const orderList = async (req, res) => {
  const { cliente_id } = req.query;

  try {
    let orders;
    if (cliente_id) {
      const cliente = await dataBase("clientes")
        .where({ id: cliente_id })
        .first();
      if (!cliente) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
      orders = await dataBase("pedidos").where({ cliente_id });
    } else {
      orders = await dataBase("pedidos");
    }
    const detailedOrder = await Promise.all(
      orders.map(async (pedido) => {
        const pedido_produtos = await dataBase("pedido_produtos").where({
          pedido_id: pedido.id,
        });
        return {
          pedido,
          pedido_produtos,
        };
      })
    );
    return res.status(200).json(detailedOrder);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao listar pedidos", error: error.message });
  }
};
module.exports = orderList;
