const mysql = require ("mysql");
// var pool = mysql.createPool({
//     "connectionLimit": 6000,
//     "user":"u800317173_facul",
//     "password": "Faculroot123*",
//     "database": "u800317173_facul",
//     "host": "195.35.61.57",
//     "port":3306
// })
var pool = mysql = require("mysql")({
    connetionLimit: 6000,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
});

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