const { notbookexist, accountexist, historyMemberPassed, companyaccountFindAndUpdateOne, notbookUpdated, componyaccountsHistory } = require('../../helper/public_methods');
const { generatePrefixedUUID, generateRandomString } = require("../../helper/uuid");
const historyController = {};
historyController.create = async (req, res) => {

    try {
        if (!req.body.uuid) {
            req.body.uuid = generatePrefixedUUID('NH');
        }
        let notbookexisted = await notbookexist(req.body);
        let accountexisted = await accountexist(req.body);
        console.log("solde operation ", notbookexisted);
        if (notbookexisted.message == true && accountexisted.message == true) {
            if (notbookexisted.data.sold_operation == 0 || notbookexisted.data.note_status == "pending" || notbookexisted.data.note_status == "unavailable") {
                // console.log("notboook are unavalable");

                return res.status(400).send({
                    message: "book unaivalable",
                    error: error,
                    data: null
                });
            }
            // console.log('tub finded', notbookexist);
            if (notbookexisted.data.operation_done == 0) {
                let creation_status = 'pending';
                if (req.body.done_by.type == 'manager') {
                    creation_status = 'validated';
                    await companyaccountFindAndUpdateOne(req.body)
                }
                let newDataNotbook = {
                    operation_done: notbookexisted.data.operation_done + 1,
                    sold_operation: notbookexisted.data.sold_operation - 1,
                };
                await notbookUpdated(notbookexist, newDataNotbook);
                let historyMemberpassed = await historyMemberPassed(req.body);
                if (historyMemberpassed) {
                    console.log("history b");
                    await componyaccountsHistory(req.body);
                    console.log("history e");

                    return res.status(200).send({
                        message: "sussess",
                        error: null,
                        data: historyMemberpassed.data
                    });
                }
            }
            else {
                if (req.body.type_operation == 'entry') {

                    if (notbookexisted.data.amount == req.body.amount) {
                        let historyMemberpassed = await historyMemberPassed(req.body);
                        let newDataNotbook = {
                            operation_done: notbookexisted.data.operation_done + 1,
                            sold_operation: notbookexisted.data.sold_operation - 1,
                        };
                        await notbookUpdated(notbookexisted, newDataNotbook);
                        return res.status(200).send({
                            message: "sussess",
                            error: null,
                            data: historyMemberpassed.data
                        });

                    }
                    else {
                        return res.status(400).send({
                            message: "Error occured",
                            error: null,
                            data: historyMemberpassed.data
                        });
                    }
                }
            }
        }
        else {
            return res.status(400).send({
                message: "error occured",
                error: null,
                data: null
            });
        }
    } catch (error) {
        console.log("error cactched " + error);
        return res.status(500).send({
            message: "error occured",
            error: error,
            data: null
        });
    }
}
module.exports = historyController;