const { companyaccountsHistorys } = require("../../../db.provider");
const { generatePrefixedUUID, generateRandomString } = require("../../helper/uuid");
const companyaccountHistoryControllerr = {};

companyaccountHistoryControllerr.getAll = async (req, res) => {
  try {
    const companyaccountHistory = await companyaccountsHistorys.find({});
    res.status(200).send({
      message: "success",
      error: null,
      data: companyaccountHistory
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

companyaccountHistoryControllerr.create = async (req, res) => {
  if (
    !req.body.operation ||
    !req.body.type_operation ||
    !req.body.amount ||
    !req.body.done_by ||
    !req.body.done_at ||
    !req.body.mouvment ||
    !req.body.valideted_by

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
    req.body.uuid = generatePrefixedUUID("OPH");
  }

  try {
    const result = await companyaccountsHistorys.create(req.body);
    res.status(200).send({
      message: "success",
      error: null,
      data: result
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({
        message: "error occured",
        error: error,
        data: null
      });
  }
}

companyaccountHistoryControllerr.getSingle = async (req, res) => {

  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "error", error: "No data found", data: null });
    return;
  }
  try {
    const data = await companyaccountsHistorys.findById(req.params.id);
    res.status(200).send({ message: "success", error: null, data: data });
  } catch (error) {
    res
      .status(400)
      .send({ message: "error occured", error: error, data: null });
  }
};

companyaccountHistoryControllerr.update = async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "error", error: "any id provided", data: null });
    return;
  }

  try {

    let result = await companyaccountsHistorys.findByIdAndUpdate(req.params.id, req.body);
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
      data: await companyaccountsHistorys.findById(req.params.id)
    });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "error", error: error, data: null });
  }
};

companyaccountHistoryControllerr.delete = async (req, res) => {
  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "error", error: "any id provided", data: null });
    return;
  }

  try {

    let result = await companyaccountsHistorys.findByIdAndDelete(req.params.id);
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

module.exports = companyaccountHistoryControllerr;