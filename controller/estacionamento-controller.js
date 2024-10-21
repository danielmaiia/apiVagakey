const oracleDb = require("../oracle");

//cria estacionamento
exports.createEstacionamento = async (req, res) => {
    try {
        const query = `INSERT INTO estacionamento (id_estacionamento, nome, endereco) 
                       VALUES (seq_estacionamento.nextval, :nome, :endereco)`;

        const response = await oracleDb.execute(query, {
            nome: req.body.nome,
            endereco: req.body.endereco
        });

        res.status(201).send({ message: "Estacionamento criado com sucesso", data: response });
    } catch (error) {
        res.status(500).send({ message: "Erro ao criar estacionamento", error });
    }
};


// pesquisa estacionamentos

exports.searchEstacionamentos = async (req, res) => {
    try {
        let query = `SELECT * FROM estacionamento WHERE 1=1`;
        const params = {};

        if (req.query.nome) {
            query += ` AND nome LIKE :nome`;
            params.nome = `%${req.query.nome}%`;
        }

        const estacionamentos = await oracleDb.execute(query, params);

        if (estacionamentos.rows.length === 0) {
            return res.status(404).send({ message: "Nenhum estacionamento encontrado" });
        }

        res.status(200).send(estacionamentos.rows);
    } catch (error) {
        res.status(500).send({ message: "Erro ao buscar estacionamentos", error });
    }
};
