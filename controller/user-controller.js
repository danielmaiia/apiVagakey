const oracleDb = require("../oracle");
const bcrypt = require ("bcrypt");
const jwt = require ("jsonwebtoken");
// const { response } = require("../app");
// const jwtSecret = "projetoVagaKey"
const jwtSecret = process.env.JWT_Secret || "defaultSecret";

//cria usuário
exports.postUser = async (req, res) => {
    try {
        console.log('Requisição recebida no POST /user/create:', req.body);

        // Consulta a existência do usuário no banco de dados
        const query = `SELECT * FROM usuario WHERE email = :email`;
        const user = await oracleDb.execute(query, { email: req.body.email });

        if (user.rows.length === 0) {
            // Criptografar a senha e inserir o usuário usando a procedure
            bcrypt.hash(req.body.senha, 10, async (error, hash) => {
                if (error) {
                    return res.status(500).send({ message: "Erro ao gerar hash da senha" });
                }

                const insertQuery = `
                    BEGIN
                        inserir_usuario(:nome, :email, :senha, :telefone);
                    END;
                `;
                const response = await oracleDb.execute(insertQuery, {
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: hash,  // Salva o hash da senha no banco de dados
                    telefone: req.body.telefone
                });

                res.status(201).send({ message: "Usuário criado com sucesso", data: response });
            });
        } else {
            res.status(400).send({ message: "Usuário já existe" });
        }
    } catch (error) {
        console.log("Erro ao executar a query", error);
        res.status(500).send({ message: "Erro no servidor", error });
    }
};



//função login

exports.auth = async (req, res) => {

    try {
        
        var password = req.body.senha
        //consulta a existência do usuário no db
         const query = `SELECT * FROM usuario WHERE email = :email`;
         const user = await oracleDb.execute(query, { email: req.body.email }); 

         if (user.rows.length > 0) {
            bcrypt.compare(req.body.senha, user.rows[0].SENHA).then(async (result) => {
                if (result) {
                    const token = jwt.sign({
                        id_usuario: user.rows[0].ID_USUARIO,
                        email: user.rows[0].EMAIL
                    }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '10h' });

                    res.status(200).json({
                        token: token,
                        nome: user.rows[0].NOME,
                        email: user.rows[0].EMAIL,
                        telefone: user.rows[0].TELEFONE
                    });

                } else {
                    res.status(400).send({ message: "Senha incorreta" });
                }
            });
        } else {
            res.status(404).send({ message: "Usuário não encontrado" });
        }
    } catch (error) {
        res.status(500).send({ message: error });
    }
};

//função updateUser

exports.updateUser = async (req, res) => {
    try {
        const query = `UPDATE usuario SET nome = :nome, telefone = :telefone WHERE email = :email`;
        const response = await oracleDb.execute(query, {
            nome: req.body.name,
            telefone: req.body.telefone,
            email: req.body.email
        });

        if (response.rowsAffected === 0) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        res.status(200).send({ message: "Usuário atualizado com sucesso" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao atualizar usuário", error });
    }
};


//função deleteUser

exports.deleteUser = async (req, res) => {
    try {
        const query = `DELETE FROM usuario WHERE email = :email`;
        const response = await oracleDb.execute(query, { email: req.body.email });

        if (response.rowsAffected === 0) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        res.status(200).send({ message: "Usuário deletado com sucesso" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao deletar usuário", error });
    }
};


//buscar usuario por email

exports.getUserByEmail = async (req, res) => {
    try {
        const query = `SELECT * FROM usuario WHERE email = :email`;
        const response = await oracleDb.execute(query, { email: req.body.email });

        if (user.length === 0) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        res.status(200).send(user[0]);
    } catch (error) {
        res.status(500).send({ message: "Erro ao buscar usuário", error });
    }
};
