const mysql = require("../mysql");

exports.get = async(req, res) => {
    try {
        const query = `select * from Usuario 
        `
        const response = await mysql.execute(query)
        console.log(response);
        res.send(response);
    }
    catch (error) {console.log("Error",error)}
};

