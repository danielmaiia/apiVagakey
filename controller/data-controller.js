const oracleDb = require("../oracle");

exports.get = async(req, res) => {
    try {
        const query = `SELECT * from USUARIO`;
        const response = await oracleDb.execute(query)
        console.log(response);
        res.send(response);
    } catch (error) {
        console.log("Error",error);
        res.status(500).send({message: "Erro ao buscar dados", error});
    }
};

