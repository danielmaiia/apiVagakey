const oracleDb = require("../oracle");

// Cria uma nova reserva
exports.createReserva = async (req, res) => {
    try {
        // Verifica se o estacionamento existe
        const queryEstacionamento = `SELECT * FROM estacionamento WHERE id_estacionamento = :id_estacionamento`;
        const estacionamento = await oracleDb.execute(queryEstacionamento, { id_estacionamento: req.body.idEstacionamento });

        if (estacionamento.rows.length === 0) {
            return res.status(404).send({ message: "Estacionamento não encontrado" });
        }

        // Cria a reserva
        const queryReserva = `INSERT INTO reserva (id_reserva, id_usuario, id_veiculo, id_estacionamento, data_reserva, horario_inicio, horario_fim)
                              VALUES (seq_reserva.nextval, :id_usuario, :id_veiculo, :id_estacionamento, SYSDATE, :horario_inicio, :horario_fim)`;
        const response = await oracleDb.execute(queryReserva, {
            id_usuario: req.body.idUsuario,
            id_veiculo: req.body.idVeiculo,
            id_estacionamento: req.body.idEstacionamento,
            horario_inicio: req.body.horarioInicio,
            horario_fim: req.body.horarioFim
        });

        res.status(201).send({ message: "Reserva criada com sucesso", data: response });
    } catch (error) {
        res.status(500).send({ message: "Erro ao criar reserva", error });
    }
};

// Lista todas as reservas
exports.getAllReservas = async (req, res) => {
    try {
        const query = `SELECT * FROM reserva`;
        const reservas = await oracleDb.execute(query);

        if (reservas.rows.length === 0) {
            return res.status(404).send({ message: "Nenhuma reserva encontrada" });
        }

        res.status(200).send(reservas.rows);
    } catch (error) {
        res.status(500).send({ message: "Erro ao buscar reservas", error });
    }
};

// Atualiza uma reserva existente (por exemplo, status da reserva)
exports.updateReserva = async (req, res) => {
    try {
        const query = `UPDATE reserva SET horario_inicio = :horario_inicio, horario_fim = :horario_fim WHERE id_reserva = :id_reserva`;
        const response = await oracleDb.execute(query, {
            horario_inicio: req.body.horarioInicio,
            horario_fim: req.body.horarioFim,
            id_reserva: req.body.idReserva
        });

        if (response.rowsAffected === 0) {
            return res.status(404).send({ message: "Reserva não encontrada" });
        }

        res.status(200).send({ message: "Reserva atualizada com sucesso" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao atualizar reserva", error });
    }
};

// Finaliza uma reserva
exports.finalizarReserva = async (req, res) => {
    try {
        // Busca detalhes da reserva
        const queryReserva = `SELECT horario_inicio, horario_fim FROM reserva WHERE id_reserva = :id_reserva`;
        const reserva = await oracleDb.execute(queryReserva, { id_reserva: req.body.idReserva });

        if (reserva.rows.length === 0) {
            return res.status(404).send({ message: "Reserva não encontrada" });
        }

        // Calcula o tempo de permanência
        const dataHoraEntrada = new Date(reserva.rows[0].HORARIO_INICIO);
        const dataHoraSaida = new Date(); // Hora atual como hora de saída
        const diferencaHoras = (dataHoraSaida - dataHoraEntrada) / (1000 * 60 * 60); // Diferença em horas

        // Calcula o valor total com base na tarifa por hora (simulação de valor para reserva)
        const valorTotal = diferencaHoras * 10; // Ajuste o valor da tarifa conforme necessário

        // Atualiza a reserva com a hora de saída e finaliza
        const queryUpdateReserva = `UPDATE reserva SET horario_fim = :horario_fim WHERE id_reserva = :id_reserva`;
        await oracleDb.execute(queryUpdateReserva, {
            horario_fim: dataHoraSaida,
            id_reserva: req.body.idReserva
        });

        // Cria o pagamento relacionado à reserva
        const queryInsertPagamento = `INSERT INTO pagamento (id_pagamento, id_reserva, valor, metodo_pagamento, codigo_pix, codigo_cartao) 
                                      VALUES (seq_pagamento.nextval, :id_reserva, :valor, :metodo_pagamento, :codigo_pix, :codigo_cartao)`;
        await oracleDb.execute(queryInsertPagamento, {
            id_reserva: req.body.idReserva,
            valor: valorTotal,
            metodo_pagamento: req.body.metodoPagamento,
            codigo_pix: req.body.codigoPix || null,
            codigo_cartao: req.body.codigoCartao || null
        });

        res.status(200).send({ message: "Reserva finalizada e pagamento efetuado com sucesso", valorTotal });
    } catch (error) {
        res.status(500).send({ message: "Erro ao finalizar reserva", error });
    }
};

// Cancela uma reserva existente e atualiza o número de vagas disponíveis
exports.cancelarReserva = async (req, res) => {
    try {
        // Verifica se a reserva existe
        const queryReserva = `SELECT * FROM reserva WHERE id_reserva = :id_reserva`;
        const reserva = await oracleDb.execute(queryReserva, { id_reserva: req.params.idReserva });

        if (reserva.rows.length === 0) {
            return res.status(404).send({ message: "Reserva não encontrada" });
        }

        // Cancela a reserva
        const queryCancelReserva = `UPDATE reserva SET horario_fim = SYSDATE WHERE id_reserva = :id_reserva`;
        await oracleDb.execute(queryCancelReserva, { id_reserva: req.params.idReserva });

        res.status(200).send({ message: "Reserva cancelada com sucesso" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao cancelar reserva", error });
    }
};
