const UserController = require("./user.controller");
const router = require("express").Router();

router.get("/all",UserController.getAll);
router.get("/:id",UserController.getSingleUser);
router.post("/",UserController.create);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

module.exports = router;