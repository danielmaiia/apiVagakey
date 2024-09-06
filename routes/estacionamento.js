const express = require("express");
const router = express.Router();
const estacionamentoController = require("../controller/estacionamento-controller");

// Rota de inserção de estacionamento
router.post("/estacionamento", estacionamentoController.createEstacionamento);
// Rota de pesquisa de estacionamentos com filtros
router.get("/search", estacionamentoController.searchEstacionamentos);

module.exports = router;