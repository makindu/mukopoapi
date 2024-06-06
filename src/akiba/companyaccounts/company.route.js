const companyaccount = require("./company.controller");
const router = require("express").Router();

router.get("/all", companyaccount.getAll);
router.get("/:id", companyaccount.getSingle);
router.post("/", companyaccount.create);
router.put("/:id", companyaccount.update);
router.delete("/:id", companyaccount.delete);

module.exports = router;