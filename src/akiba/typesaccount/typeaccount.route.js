const TypesAccountController = require("./typeaccount.controller");
const router = require("express").Router();

router.get("/all",TypesAccountController.getAll);
router.get("/:id",TypesAccountController.getSingle);
router.post("/",TypesAccountController.create);
router.put("/:id", TypesAccountController.update);
router.delete("/:id", TypesAccountController.delete);

module.exports = router;