const { notbookexist, accountexist, historyMemberPassed, companyaccountFindAndUpdateOne, notbookUpdated, componyaccountsHistory } = require('../../helper/public_methods');
const { generatePrefixedUUID, generateRandomString } = require("../../helper/uuid");

const NotebookOperationSocket = async (io) => {
    io.on("new_notebook_operation", async (data) => {

        try {
            if (!data.uuid) {
                data.uuid = generatePrefixedUUID('NH');
            }
            let notbookexisted = await notbookexist(data);
            let accountexisted = await accountexist(data);
            if (notbookexisted.message == true && accountexisted.message == true) {
                if (notbookexisted.data.sold_operation == 0 || notbookexisted.data.note_status == "pending" || notbookexisted.data.note_status == "unavailable") {
                    // console.log("notboook are unavalable");

                    return io.emit("new_notebook_operation", {
                        status: 400,
                        message: "book unavailable",
                        error: null,
                        data: null
                    });
                }
                // console.log('tub finded', notbookexist);
                if (notbookexisted.data.operation_done == 0) {

                    let historyMemberpassed = await historyMemberPassed(data);
                    await companyaccountFindAndUpdateOne(data)
                    await componyaccountsHistory(data, historyMemberpassed, notbookexisted, "first_deposit");
                    let newDataNotbook = {
                        operation_done: notbookexisted.data.operation_done + 1,
                        sold_operation: notbookexisted.data.sold_operation - 1,
                    };
                    await notbookUpdated(notbookexist, newDataNotbook);
                    return io.emit("new_notebook_operation", {
                        status: 200,
                        message: "success",
                        error: null,
                        data: historyMemberpassed
                    });
                }
                else {
                    if (data.type_operation == 'entry') {

                        if (notbookexisted.data.amount == data.amount) {
                            let historyMemberpassed = await historyMemberPassed(data);
                            let newDataNotbook = {
                                operation_done: notbookexisted.data.operation_done + 1,
                                sold_operation: notbookexisted.data.sold_operation - 1,
                            };
                            await notbookUpdated(notbookexisted, newDataNotbook);
                            return io.emit("new_notebook_operation", {
                                status: 200,
                                message: "success",
                                error: null,
                                data: historyMemberpassed
                            });
                        }
                        else {
                            return io.emit("new_notebook_operation", {
                                status: 400,
                                message: "error occured",
                                error: null,
                                data: null
                            });
                        }
                    }
                }
            }
            else {
                io.emit("new_notebook_operation", {
                    status: 400,
                    message: "error occured",
                    error: error,
                    data: null
                });
            }
        } catch (error) {
            // console.log("error cactched " + error);
            io.emit("new_notebook_operation", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });
};

module.exports = NotebookOperationSocket;