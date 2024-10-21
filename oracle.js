const oracledb = require('oracledb');

let pool;  // Armazena o pool para reutilizar as conexões

// Inicializando a pool de conexões
async function initialize() {
    try {
        console.log("DB_HOST:", process.env.DB_HOST);
        console.log("DB_PORT:", process.env.DB_PORT);
        console.log("DB_SID:", process.env.DB_SID);
        pool = await oracledb.createPool({
            user: process.env.DB_USER,          // Usuário vindo do .env
            password: process.env.DB_PASSWORD,  // Senha do .env
            connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_SID}` // Conexão Oracle no formato host:port/service_name
        });
        console.log('Conexão com Oracle DB estabelecida');
    } catch (error) {
        console.error('Erro ao conectar com Oracle DB', error);
        throw error;
    }
}

// Função para executar queries
async function execute(query, binds = [], options = {}) {
    let connection;

    options.outFormat = oracledb.OUT_FORMAT_OBJECT; // Para receber resultados em formato de objeto

    try {
        connection = await pool.getConnection();  // Utiliza a pool
        const result = await connection.execute(query, binds, options);
        return result;
    } catch (error) {
        console.error('Erro ao executar a query', error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();  // Fechar a conexão após o uso
            } catch (closeError) {
                console.error('Erro ao fechar a conexão', closeError);
            }
        }
    }
}

module.exports = {
    initialize,
    execute
};
