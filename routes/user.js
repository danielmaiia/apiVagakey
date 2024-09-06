const express = require("express");
const router = express.Router();
const userController = require ("../controller/user-controller");

//Criação de usuário
router.post("/create", userController.postUser);
//Criação de usuário
router.post("/login", userController.auth);
//Criação de usuário
// router.post("/update", userController.pupdateUser);
// //Criação de usuário
// router.post("/delete", userController.deleteUser);
// //Criação de usuário
// router.post("/list", userController.listUser);

module.exports = router;