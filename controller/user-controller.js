const mysql = require("../mysql");
const bcrypt = require ("bcrypt");
const jwt = require ("jsonwebtoken");
const jwtSecret = "projetoVagaKey"

//cria usuário
exports.postUser = async(req, res) => {

    try {
        //consulta a existência do usuário no db
        const query = `SELECT * FROM Usuario WHERE Email = ?`;
        const user = await mysql.execute(query, [req.body.email]);

        if (user.length === 0) { 
            // Se o usuário não existir, criptografamos a senha e inserimos o usuário
            bcrypt.hash(req.body.password, 10, async (error, hash) => {
                if (error) {
                    return res.status(500).send({ message: "Erro ao gerar hash da senha" });
                }

                const insertQuery = `
                    INSERT INTO Usuario (Nome, Email, Senha, Telefone, TipoUsuario, DataCriacao)
                    VALUES (?, ?, ?, ?, ?, NOW())
                `;

                try {
                    const response = await mysql.execute(insertQuery, [
                        req.body.name,
                        req.body.email,
                        hash,
                        req.body.telefone,
                        req.body.tipousuario
                    ]);
                    res.status(201).send({ message: "Usuário criado com sucesso", data: response });
                } catch (insertError) {
                    res.status(500).send({ message: "Erro ao inserir usuário", error: insertError });
                }
            });
        } else {
            res.status(400).send({ message: "Usuário já existe" });
        }
    } catch (error) {
        console.log("Error", error);
        res.status(500).send({ message: "Erro no servidor", error });
    }
};

//função login

exports.auth = async (req, res) => {

    try {
        
        var password = req.body.password
        //consulta a existência do usuário no db
         const query = `SELECT * FROM Usuario WHERE Email = ?`;
         const user = await mysql.execute(query, [req.body.email]); 

         if (user.length > 0) {
            bcrypt.compare(password, user[0].Senha).then(async(result)=>{
                if (result){
                    jwt.sign({
                        "email": user[0].Email
                    },
                    jwtSecret,
                    {expiresIn: "10h"},(error, token) => {
                        if (error){
                            res.json(error)
                        } else {
                            res.status(200)
                            res.json({
                                token: token,
                                Nome: user[0].Nome,
                                Email: user[0].Email,
                                Telefone: user[0].Telefone,
                                tipousuario: user[0].TipoUsuario
                            })
                        }
                    }
                ) 
                }else{res.status(400).send({ message: "Senha incorreta" });}
            })
         }
    }   catch (error){
        res.status(400).send({ message: error});
    }
}

//função updateUser

exports.updateUser = async (req, res) => {
    try {
        const query = `UPDATE Usuario SET Nome = ?, Telefone = ? WHERE Email = ?`;
        const response = await mysql.execute(query, [req.body.name, req.body.telefone, req.body.email]);

        if (response.affectedRows === 0) {
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
        const query = `DELETE FROM Usuario WHERE Email = ?`;
        const response = await mysql.execute(query, [req.body.email]);

        if (response.affectedRows === 0) {
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
        const query = `SELECT * FROM Usuario WHERE Email = ?`;
        const user = await mysql.execute(query, [req.params.email]);

        if (user.length === 0) {
            return res.status(404).send({ message: "Usuário não encontrado" });
        }

        res.status(200).send(user[0]);
    } catch (error) {
        res.status(500).send({ message: "Erro ao buscar usuário", error });
    }
};
