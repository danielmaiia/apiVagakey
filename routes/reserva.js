const express = require("express");
const router = express.Router();
const reservaController = require("../controller/reserva-controller");

// Rota para criar uma nova reserva
router.post("/reservar", reservaController.createReserva);

// Rota para listar todas as reservas
router.get("/list", reservaController.getAllReservas);

// Rota para atualizar uma reserva
router.put("/update", reservaController.updateReserva);

// Rota para finalizar uma reserva
router.post("/finalizar", reservaController.finalizarReserva);

// Rota para cancelar uma reserva
router.delete("/cancelar/:idReserva", reservaController.cancelarReserva);

module.exports = router;
