const { componyaccounts } = require("../../../db.provider");

const { generatePrefixedUUID, generateRandomString } = require('../../helper/uuid');
const companyaccountControllerr = {};

companyaccountControllerr.getAll = async (req, res) => {
  try {
    const companyaccounts = await componyaccounts.find({});
    res.status(200).send({
      message: "success",
      error: null,
      data: companyaccounts
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "error occured",
        error: error,
        data: []
      });
  }
}

companyaccountControllerr.create = async (req, res) => {
  if (
    !req.body.code ||
    !req.body.manager ||
    !req.body.money_id ||
    // !req.body.sold &&
    !req.body.id_operation ||
    !req.body.type_operation ||
    !req.body.operation ||
    !req.body.amount ||
    !req.body.done_by ||
    !req.body.validated ||
    !req.body.mouvement
  ) {
    res
      .status(400)
      .send({
        message: "fields required",
        error: null,
        data: null
      });
  }
  if (!req.body.uuid) {
    req.body.uuid = generatePrefixedUUID('OP');
  }
  try {
    const result = await componyaccounts.create(req.body);
    if (result) {

      res.status(200).send({
        message: "success",
        error: null,
        data: result
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({
        message: "error occured",
        error: error,
        data: null
      });
  }
}

companyaccountControllerr.getSingle = async (req, res) => {

  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "error", error: "No data found", data: null });
    return;
  }
  try {
    const data = await componyaccounts.findById(req.params.id);
    res.status(200).send({ message: "success", error: null, data: data });
  } catch (error) {
    res
      .status(400)
      .send({ message: "error occured", error: error, data: null });
  }
};

companyaccountControllerr.update = async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "error", error: "any id provided", data: null });
    return;
  }

  try {

    let result = await componyaccounts.findByIdAndUpdate(req.params.id, req.body);
    if (!result) {
      res.status(404).send({
        message: "not found",
        error: null,
        data: null
      });
      return;
    }
    return res.status(200).send({
      message: "success",
      error: null,
      data: await componyaccounts.findById(req.params.id)
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "error", error: error, data: null });
  }
};

companyaccountControllerr.delete = async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "error", error: "any id provided", data: null });
    return;
  }

  try {

    let result = await componyaccounts.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).send({
        message: "not found",
        error: null,
        data: null
      });
    }
    res.status(200).send({
      message: "success",
      error: null,
      data: result
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "error", error: error, data: null });
  }
};

async function companyaccountDefault() {
  let accountData = [
    {
      description: "compte en francs congolais",
      money: "CDF",
      sold: 0
    },
    {
      description: "compte dollars americains",
      money: "USD",
      sold: 0
    },
  ];
  try {
    // Vérifier si les comptes existent déjà
    const existingAccounts = await componyaccounts.find({
      money: { $in: accountData.map(acc => acc.money) }
    });

    const existingMoneyTypes = existingAccounts.map(acc => acc.money);

    // Filtrer les comptes qui n'existent pas encore
    const newAccounts = accountData.filter(acc => !existingMoneyTypes.includes(acc.money));

    if (newAccounts.length > 0) {
      await componyaccounts.insertMany(newAccounts);
      console.log("Comptes créés : ", newAccounts);
    } else {
      console.log("Les comptes existent déjà.");
    }
  } catch (error) {
    console.error("Erreur lors de la vérification ou de la création des comptes : ", error);
  }

  // componyaccounts.insertMany(account);
  // console.log("App lunched at 3000");
}




module.exports = { companyaccountControllerr, companyaccountDefault };