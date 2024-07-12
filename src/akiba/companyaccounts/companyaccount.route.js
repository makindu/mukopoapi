const { companyaccountControllerr, companyaccountDefault } = require("./companyaccount.controller");
const router = require("express").Router();

router.get("/all", companyaccountControllerr.getAll);
router.get("/:id", companyaccountControllerr.getSingle);
router.post("/", companyaccountControllerr.create);
router.put("/:id", companyaccountControllerr.update);
router.delete("/:id", companyaccountControllerr.delete);

module.exports = router;