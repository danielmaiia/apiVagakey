require('dotenv').config();

const http = require("http");
const app = require("./app");
const oracleDb = require('./oracle'); // O novo arquivo oracle.js

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await oracleDb.initialize(); // Inicializa a conexão com Oracle DB
        const server = http.createServer(app);
        server.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
    } catch (error) {
        console.error('Erro ao inicializar o servidor:', error);
        process.exit(1);
    }
}

startServer();