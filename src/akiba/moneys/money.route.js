const MoneyController = require("./money.controller");
const router = require("express").Router();

router.get("/all",MoneyController.getAll);
router.get("/:id",MoneyController.getSingle);
router.post("/",MoneyController.create);
router.put("/:id", MoneyController.update);
router.delete("/:id", MoneyController.delete);

module.exports = router;