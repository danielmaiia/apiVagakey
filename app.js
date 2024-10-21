const express = require('express');
const app = express();
const cors = require("cors");
const parser = require("body-parser");

//middleware de cors
app.use(cors());

//middleware de parsing do body

app.use(parser.urlencoded({extended: true}));
app.use(parser.json())

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
//     res.header('Access-Control-Allow-Headers','Origin, X-Request-With, Content-Type, Accept, Authorization');
//  app.use(cors());
//     next();
// });

//Rotas

const routeUser = require("./routes/user");
app.use("/user", routeUser);

const routeData = require("./routes/data");
app.use("/data", routeData);

module.exports = app;