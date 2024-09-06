const mysql = require ("../mysql");

//cria estacionamento
exports.createEstacionamento = async (req, res) => {
    try {
        const query = `INSERT INTO Estacionamentos (Nome, CapacidadeTotal, VagasDisponiveis, TarifaPorHora, HorarioFuncionamento, ID_Usuario, Endereco_CEP, Endereco_Cidade, Endereco_Estado, Endereco_Numero, Endereco_Rua) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const response = await mysql.execute(query, [
            req.body.nome,
            req.body.capacidadeTotal,
            req.body.vagasDisponiveis,
            req.body.tarifaPorHora,
            req.body.horarioFuncionamento,
            req.body.idUsuario,
            req.body.enderecoCep,
            req.body.enderecoCidade,
            req.body.enderecoEstado,
            req.body.enderecoNumero,
            req.body.enderecoRua
        ]);

        res.status(201).send({ message: "Estacionamento criado com sucesso", data: response });
    } catch (error) {
        res.status(500).send({ message: "Erro ao criar estacionamento", error });
    }
};

// pesquisa estacionamentos

exports.searchEstacionamentos = async (req, res) => {
    try {
        // Construir query com base nos filtros fornecidos
        let query = `SELECT * FROM Estacionamentos WHERE 1=1`;
        const params = [];

        // Filtros opcionais
        if (req.query.nome) {
            query += ` AND Nome LIKE ?`;
            params.push(`%${req.query.nome}%`);
        }

        if (req.query.cidade) {
            query += ` AND Endereco_Cidade LIKE ?`;
            params.push(`%${req.query.cidade}%`);
        }

        if (req.query.capacidadeMinima) {
            query += ` AND CapacidadeTotal >= ?`;
            params.push(req.query.capacidadeMinima);
        }

        if (req.query.vagasDisponiveis) {
            query += ` AND VagasDisponiveis >= ?`;
            params.push(req.query.vagasDisponiveis);
        }

        // Executar a query com os parâmetros
        const estacionamentos = await mysql.execute(query, params);

        if (estacionamentos.length === 0) {
            return res.status(404).send({ message: "Nenhum estacionamento encontrado" });
        }

        res.status(200).send(estacionamentos);
    } catch (error) {
        res.status(500).send({ message: "Erro ao buscar estacionamentos", error });
    }
};