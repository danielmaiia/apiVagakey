const mysql = require ("mysql");
var pool = mysql.createPool({
    "connectionLimit": 6000,
    "user":"u800317173_facul",
    "password": "Faculroot123*",
    "database": "u800317173_facul",
    "host": "195.35.61.57",
    "port":3306
})

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