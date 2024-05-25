const AccountController = require("./account.controller");
const router = require("express").Router();

router.get("/all",AccountController.getAll);
router.get("/:id",AccountController.getSingle);
router.post("/",AccountController.create);
router.put("/:id", AccountController.update);
router.delete("/:id", AccountController.delete);

module.exports = router;