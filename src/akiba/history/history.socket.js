const { notbookexist, accountexist, notbookUpdated, historyMemberPassed, companyaccountFindAndUpdateOne, accounnotbookUpdated, componyaccountsHistory } = require('../../helper/public_methods');
const { generatePrefixedUUID, generateRandomString } = require("../../helper/uuid");

const NotebookOperationSocket = async (io) => {
    io.on("new_notebook_operation", async (data) => {

        try {
            if (!data.uuid) {
                data.uuid = generatePrefixedUUID('NH');
            }
            let historyStatus = "pending";
            let validation = false;
            type_operation = "next entry";
            let existingNoteBook = await notbookexist(data);
            let existingaccount = await accountexist(data)
            if (existingNoteBook.message == true && existingaccount.message == true) {

                if (existingNoteBook.data.operation_done == existingNoteBook.data.sold_operation && existingNoteBook.data.note_status == 'pending' || existingNoteBook.data.note_status == 'unavalable') {
                    io.emit("new_notebook_operation", {
                        status: 400,
                        message: "error occured",
                        error: "book are note avalaible please active it then continue",
                        data: null
                    });
                }

                if (data.notebook.operation_done == 0 && data.member.type == 'manager') {
                    type_operation = "first deposit";
                    historyStatus = "validated";
                    data.creation_status = historyStatus;
                    let companyaccount = await companyaccountFindAndUpdateOne(data);
                    if (companyaccount.message == true) {
                        console.log("Solde componyaccount updated ");
                        let membernoteBookUpdate = await notbookUpdated(data);
                        if (membernoteBookUpdate.message == true) {
                            io.emit("notebook_updated", {
                                status: 200,
                                message: "success",
                                error: null,
                                data: membernoteBookUpdate.data
                            });
                            let historyMember = await historyMemberPassed(data);
                            if (historyMember.message == true) {
                                console.log("hisory member passed ", data.mouvment);
                                historyMember.data.type_operation = type_operation;
                                data.mouvment = data.mouvment;
                                validation = true;
                                data.validation = validation;
                                let historyCompanyaccountPassed = await componyaccountsHistory(historyMember.data, data, historyStatus);
                                console.log("hisory compony account init", historyCompanyaccountPassed);
                                if (historyCompanyaccountPassed.message == true) {
                                    console.log("hisory compony account passed");
                                    return io.emit("new_notebook_operation", {
                                        status: 200,
                                        message: "success",
                                        error: null,
                                        data: historyCompanyaccountPassed.data
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
                        else {
                            return io.emit("notebook_updated", {
                                status: 400,
                                message: "error occured",
                                error: null,
                                data: null
                            });
                        }
                    }

                }
                if (parseInt(existingNoteBook.data.amount) < parseInt(data.amount)) {
                    let lengthHistory = parseInt(data.amount) / parseInt(existingNoteBook.data.amount);
                    let singleSold = parseInt(data.amount) / Math.ceil(lengthHistory);
                    let memberAccountUpdate = await accounnotbookUpdated(data);
                    if (memberAccountUpdate.message == true) {

                        let historyMembers = [];
                        for (let index = 0; index < Math.ceil(lengthHistory); index++) {
                            console.log("here", lengthHistory, data.amount, existingNoteBook.data.amount);
                            data.type_operation = type_operation;
                            let notbookUpdate = await notbookUpdated(data);
                            if (notbookUpdate.message == true) {
                                io.emit("notebook_updated", {
                                    status: 200,
                                    message: "success",
                                    error: null,
                                    data: notbookUpdate.data
                                });
                                data.amount = singleSold;
                                let historyMember = await historyMemberPassed(data);
                                if (historyMember.message == true) {
                                    historyMembers.push(historyMember.data);
                                }
                            }
                            else {
                                io.emit("notebook_updated", {
                                    status: 400,
                                    message: "error occured",
                                    error: null,
                                    data: null
                                });
                            }
                            break;
                        }

                        if (historyMembers.length > 0) {
                            io.emit("new_notebook_operation", {
                                status: 200,
                                message: "success",
                                error: null,
                                data: historyMembers
                            });
                        }
                    }
                }

                if (parseInt(existingNoteBook.data.amount) > parseInt(data.amount)) {
                    console.log("carnet supperrieur");

                }
                else if (parseInt(existingNoteBook.data.amount) == parseInt(data.amount)) {
                    let memberAccountUpdate = await accounnotbookUpdated(data);
                    if (memberAccountUpdate.message == true) {

                        let notbookUpdate = await notbookUpdated(data);
                        if (notbookUpdate.message == true) {
                            io.emit("notebook_updated", {
                                status: 200,
                                message: "success",
                                error: null,
                                data: notbookUpdate.data
                            });
                            data.type_operation = type_operation;
                            let historyMember = await historyMemberPassed(data);
                            console.log("history member ", historyMember);
                            if (historyMember.message == true) {
                                console.log("inside history member when true");
                                io.emit("new_notebook_operation", {
                                    status: 200,
                                    message: "success",
                                    error: null,
                                    data: historyMember.data
                                });
                            }
                            else {
                                io.emit("new_notebook_operation", {
                                    status: 400,
                                    message: "error occured",
                                    error: null,
                                    data: null
                                });

                            }
                        }
                        else {
                            io.emit("notebook_updated", {
                                status: 400,
                                message: "error occured",
                                error: null,
                                data: null,
                            });
                        }

                    }
                }


            }
            else {
                io.emit("new_notebook_operation", {
                    status: 400,
                    message: "error occured",
                    error: "account or notbook dosn't exist",
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