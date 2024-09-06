const mysql = require("../mysql");

// Cria uma nova reserva
exports.createReserva = async (req, res) => {
    try {
        // Verifica se há vagas disponíveis no estacionamento
        const queryEstacionamento = `SELECT VagasDisponiveis FROM Estacionamentos WHERE ID_Estacionamento = ?`;
        const estacionamento = await mysql.execute(queryEstacionamento, [req.body.idEstacionamento]);

        if (estacionamento.length === 0) {
            return res.status(404).send({ message: "Estacionamento não encontrado" });
        }

        if (estacionamento[0].VagasDisponiveis <= 0) {
            return res.status(400).send({ message: "Sem vagas disponíveis no estacionamento" });
        }

        // Cria a reserva
        const queryReserva = `INSERT INTO Reserva (DataHoraEntrada, StatusReserva, ID_Usuario, ID_Estacionamento) 
                              VALUES (NOW(), 'Ativa', ?, ?)`;
        const response = await mysql.execute(queryReserva, [req.body.idUsuario, req.body.idEstacionamento]);

        // Atualiza o número de vagas disponíveis no estacionamento
        const queryUpdateEstacionamento = `UPDATE Estacionamentos SET VagasDisponiveis = VagasDisponiveis - 1 
                                           WHERE ID_Estacionamento = ?`;
        await mysql.execute(queryUpdateEstacionamento, [req.body.idEstacionamento]);

        res.status(201).send({ message: "Reserva criada com sucesso", data: response });
    } catch (error) {
        res.status(500).send({ message: "Erro ao criar reserva", error });
    }
};

// Lista todas as reservas
exports.getAllReservas = async (req, res) => {
    try {
        const query = `SELECT * FROM Reserva`;
        const reservas = await mysql.execute(query);

        if (reservas.length === 0) {
            return res.status(404).send({ message: "Nenhuma reserva encontrada" });
        }

        res.status(200).send(reservas);
    } catch (error) {
        res.status(500).send({ message: "Erro ao buscar reservas", error });
    }
};

// Atualiza uma reserva existente (por exemplo, status da reserva)
exports.updateReserva = async (req, res) => {
    try {
        const query = `UPDATE Reserva SET StatusReserva = ? WHERE ID_Reserva = ?`;
        const response = await mysql.execute(query, [req.body.statusReserva, req.body.idReserva]);

        if (response.affectedRows === 0) {
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
        // Busca detalhes da reserva e estacionamento
        const queryReserva = `SELECT r.DataHoraEntrada, e.TarifaPorHora 
                              FROM Reserva r 
                              JOIN Estacionamentos e ON r.ID_Estacionamento = e.ID_Estacionamento
                              WHERE r.ID_Reserva = ?`;
        const reserva = await mysql.execute(queryReserva, [req.body.idReserva]);

        if (reserva.length === 0) {
            return res.status(404).send({ message: "Reserva não encontrada" });
        }

        // Calcula o tempo de permanência
        const dataHoraEntrada = new Date(reserva[0].DataHoraEntrada);
        const dataHoraSaida = new Date(); // Hora atual como hora de saída
        const diferencaHoras = (dataHoraSaida - dataHoraEntrada) / (1000 * 60 * 60); // Diferença em horas

        // Calcula o valor total com base na tarifa por hora
        const tarifaPorHora = reserva[0].TarifaPorHora;
        const valorTotal = diferencaHoras * tarifaPorHora;

        // Atualiza a reserva com a hora de saída e finaliza
        const queryUpdateReserva = `UPDATE Reserva SET DataHoraSaida = ?, StatusReserva = 'Finalizada' 
                                    WHERE ID_Reserva = ?`;
        await mysql.execute(queryUpdateReserva, [dataHoraSaida, req.body.idReserva]);

        // Cria o pagamento relacionado à reserva
        const queryInsertPagamento = `INSERT INTO Pagamento (ID_Reserva, ID_MetodoPagamento, DataPagamento, Valor, StatusPagamento, DetalhesTransacao) 
                                      VALUES (?, ?, NOW(), ?, 'Pago', ?)`;
        await mysql.execute(queryInsertPagamento, [
            req.body.idReserva,
            req.body.idMetodoPagamento,
            valorTotal,
            'Pagamento referente à reserva de estacionamento'
        ]);

        res.status(200).send({ message: "Reserva finalizada e pagamento efetuado com sucesso", valorTotal });
    } catch (error) {
        res.status(500).send({ message: "Erro ao finalizar reserva", error });
    }
};

// Cancela uma reserva existente e atualiza o número de vagas disponíveis
exports.cancelarReserva = async (req, res) => {
    try {
        // Verifica se a reserva existe
        const queryReserva = `SELECT * FROM Reserva WHERE ID_Reserva = ?`;
        const reserva = await mysql.execute(queryReserva, [req.params.idReserva]);

        if (reserva.length === 0) {
            return res.status(404).send({ message: "Reserva não encontrada" });
        }

        // Cancela a reserva
        const queryCancelReserva = `UPDATE Reserva SET StatusReserva = 'Cancelada' WHERE ID_Reserva = ?`;
        await mysql.execute(queryCancelReserva, [req.params.idReserva]);

        // Atualiza o número de vagas disponíveis no estacionamento
        const queryUpdateEstacionamento = `UPDATE Estacionamentos SET VagasDisponiveis = VagasDisponiveis + 1 
                                           WHERE ID_Estacionamento = ?`;
        await mysql.execute(queryUpdateEstacionamento, [reserva[0].ID_Estacionamento]);

        res.status(200).send({ message: "Reserva cancelada com sucesso" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao cancelar reserva", error });
    }
};
