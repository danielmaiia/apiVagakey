const express = require("express");
const router = express.Router();
const userController = require ("../controller/user-controller");

//Criação de usuário
router.post("/create", userController.postUser);
//Autenticação de usuário
router.post("/login", userController.auth);
//Atualização de usuário
router.post("/update", userController.updateUser);
// //Deleção de usuário
router.post("/delete", userController.deleteUser);


module.exports = router;