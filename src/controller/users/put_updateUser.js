const bcrypt = require("bcrypt");
const dataBase = require("../../connection/connection");
const { validateUser } = require("../../middleware/validation");

const updateUser = async (req, res) => {
    const { id } = req.user;
    const { nome, email, senha } = req.body;

    const { error } = validateUser({ nome, email, senha });
    if (error) {
        return res.status(400).send({ message: error.details[0].message });
    }

    try {
        const user = await dataBase("usuarios").where("id", id).first();
        if (!user) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        const updatedUser = {
            nome: nome || user.nome,
            email: email || user.email,
            senha: senha ? await bcrypt.hash(senha, 10) : user.senha,
        };

        await dataBase("usuarios").where("id", id).update(updatedUser);

        const { senha: _, ...userData } = updatedUser;
        return res.status(200).json(userData);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao atualizar dados do usuário",
            error: error.message,
        });
    }
};

module.exports = updateUser;