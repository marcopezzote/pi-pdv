const dataBase = require('../../connection/connection');

const getUser = async (req, res) => {
    const { id } = req.user;

    try {
        const user = await dataBase("usuarios").where("id", id).first();
        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const { senha, ...userData } = user;
        return res.status(200).json(userData);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao obter dados do usuário",
            error: error.message,
        });
    }
};

module.exports = getUser;