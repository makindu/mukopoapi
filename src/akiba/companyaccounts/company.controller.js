const { companyaccount } = require("../../../db.provider");
const companyaccountControllerr = {};

companyaccountControllerr.getAll = async (req, res) => {
  try {
    const companyaccounts = await companyaccount.find({});
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
    !req.body.code &&
    !req.body.manager &&
    !req.body.money_id &&
    !req.body.sold
  ) {
    res
      .status(400)
      .send({
        message: "fields required",
        error: null,
        data: null
      });
  }

  try {
    const result = await companyaccount.create(req.body);
    res.status(200).send({
      message: "success",
      error: null,
      data: result
    });
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
    const data = await companyaccount.findById(req.params.id);
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

    let result = await companyaccount.findByIdAndUpdate(req.params.id, req.body);
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
      data: await companyaccount.findById(req.params.id)
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

    let result = await companyaccount.findByIdAndDelete(req.params.id);
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

module.exports = companyaccountControllerr;