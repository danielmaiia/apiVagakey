// const mysql = require ("mysql");
// // var pool = mysql.createPool({
// //     "connectionLimit": 6000,
// //     "user":"u800317173_facul",
// //     "password": "Faculroot123*",
// //     "database": "u800317173_facul",
// //     "host": "195.35.61.57",
// //     "port":3306
// // })
// var pool = mysql.createPool({
//     connectionLimit: 6000,
//     user: process.env.DB_USER,          // Usuário vindo do .env
//     password: process.env.DB_PASSWORD,  // Senha do .env
//     database: process.env.DB_NAME,      // Nome do banco de dados do .env (Vagakey)
//     host: process.env.DB_HOST,          // Hostname do .env (oracle.fiap.com.br)
//     port: process.env.DB_PORT           // Porta do .env (1521)
// });

const oracledb = require('oracledb');

async function initialize() {
    try {
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        });
        console.log('Conexão com o Oracle DB estabelecida');
    } catch (error) {
        console.error('Erro ao conectar com o banco de dados Oracle', error);
    }
}

module.exports = { initialize };

exports.execute=(query, params=[])=>{
    return new Promise((resolve, reject)=>{
        pool.query(query, params,(error, result)=>{
            if (error){console.log("Erro do Banco de Dados");
                reject(error);
            }
            else {
                resolve(result);
            }
        })
    })
};

exports.pool = pool;