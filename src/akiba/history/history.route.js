const router = require("express").Router();
const historyController = require("./history.controller");

router.post("/", historyController.create);
module.exports = router;
