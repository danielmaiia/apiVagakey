const express = require("express");
const router = express.Router();

const controllerData = require("../controller/data-controller");

router.get("/get", controllerData.get);

module.exports = router;

