const { notebookoperation, companyaccountsHistorys, notebook, componyaccounts } = require('../../../db.provider');
const { notbookexist, accountexist, notbookUpdated, historyMemberPassed, companyaccountFindAndUpdateOne, accounnotbookUpdated, componyaccountsHistory, componyaccountsHistoryFindAndUpdate } = require('../../helper/public_methods');
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

                if (data.notebook.operation_done == 0 && data.member.type == 'manager' || data.member.type != 'manager') {
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
                    data.creation_status = "panding";
                    let total_deposit = 0;
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
                                data.uuid = generatePrefixedUUID('NH') + index;
                                let historyMember = await historyMemberPassed(data, index);
                                if (historyMember.message == true) {
                                    total_deposit = total_deposit + singleSold;
                                    historyMembers.push(historyMember.data);
                                    console.log("total multiple add", total_deposit);
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
                        }

                        if (historyMembers.length > 0) {
                            historyMembers[0].amount = total_deposit;
                            io.emit("new_notebook_operation", {
                                status: 200,
                                message: "success",
                                error: null,
                                data: historyMembers[0]
                            });
                            return;
                        }
                    }
                }

                if (parseInt(existingNoteBook.data.amount) > parseInt(data.amount)) {
                    console.log("carnet supperrieur");

                }
                else if (parseInt(existingNoteBook.data.amount) == parseInt(data.amount)) {
                    data.creation_status = "pending";
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
    io.on("new_notebook_operation_withdraw", async (data) => {
        console.log("withdraw data", data);
        try {
            if (data.mouvment != "withdraw" && !data.notebook) {
                return io.emit("new_notebook_operation_withdraw", {
                    status: 400,
                    message: "error occured",
                    error: null,
                    data: null
                });

            }

            let existingNoteBook = await notbookexist(data);
            if (existingNoteBook.message == true) {
                if (existingNoteBook.data.sold > 0) {
                    let membernoteBookUpdate = await notbookUpdated(data);
                    if (membernoteBookUpdate.message == true) {
                        if (!data.uuid) {
                            data.uuid = generatePrefixedUUID('WD');
                        }
                        let historyMember = await historyMemberPassed(data);
                        if (historyMember.message == true) {
                            let existingaccount = await accountexist(data);
                            if (existingaccount.message == true) {
                                let UpdatingMemberAccount = await accounnotbookUpdated(data);
                                if (UpdatingMemberAccount) {
                                    return io.emit("new_notebook_operation_withdraw", {
                                        status: 200,
                                        message: "success",
                                        error: null,
                                        data: historyMember.data
                                    });
                                }
                                else {
                                    return io.emit("new_notebook_operation_withdraw", {
                                        status: 400,
                                        message: "error occured",
                                        error: null,
                                        data: historyMember.data
                                    });
                                }
                            }
                        }
                    }
                }
            }
        } catch (error) {
            return io.emit("new_notebook_operation_withdraw", {
                status: 500,
                message: "error occured",
                error: error,
                data: null
            });
        }
    });
    io.on("getting_all_member_history", async (data) => {
        let results = await notebookoperation.find({});
        let companyHistory = await companyaccountsHistorys.find({});
        let notbookPanding = await notebook.find({});
        let datastory = [];
        let companyHistorys = [];
        let notebookPanding = [];

        companyHistory.forEach((e) => {
            let resultdata = {
                ...e.toObject(),
                nature_operation: "companyhistory"
            };
            companyHistorys.push(resultdata);
        })
        results.forEach((e) => {
            // e.member = e.member;
            let resultdata = {
                ...e.toObject(),
                nature_operation: "notebookhistory"
            };
            datastory.push(resultdata);
        })
        // console.log("member History ", datastory);
        io.emit("getting_all_member_history", {
            status: 200,
            message: "success",
            error: null,
            data: {
                memberStory: datastory,
                companyStory: companyHistorys,
                // notebookToValidate: notebookPanding

            }
        });
        // try {
        //     let historyMember = await getting_all_member_history();
        //     if (historyMember.message == true) {
        //         return io.emit("getting_all_member_history", {
        //             status: 200,
        //             message: "success",
        //             error: null,
        //             data: historyMember.data
        //         });
        //     }
        //     else {
        //         return io.emit("getting_all_member_history", {
        //             status: 400,
        //             message: "error occured",
        //             error: null,
        //             data: null
        //         });
        //     }
        // } catch (error) {
        //     console.log(error);

        //     return io.emit("getting_all_member_history", {
        //         status: 500,
        //         message: "error occured",
        //         error: error,
        //         data: null
        //     });
        // }
    });
    io.on("validate_action", async (data) => {
        if (!data) {
            return io.emit("validate_action", {
                status: 400,
                message: "error occured",
                error: null,
                data: null
            })
        }

        if (data.nature_operation == "companyhistory") {
            if (data.creation_status ==
                "pending") {
                console.log("creation status in pannding ", data);
                let creation_status = "validated";
                data.creation_status = creation_status;
                data.validation = true;
                console.log("creation status in change state");
                try {
                    console.log("creation status in change find hist", data);
                    let companyaccountHistoryUpda = await componyaccountsHistoryFindAndUpdate(data);
                    console.log("creation status in change find histUpdate ", data);
                    if (companyaccountHistoryUpda.message == true) {
                        let status = {
                            note_status: creation_status
                        }
                        let resultat = await notebook.findByIdAndUpdate(data.operation, status);
                        if (resultat) {
                            let companyaccount = {
                                sold: data.amount,
                            };
                            let accountcompany = await componyaccounts.findByIdAndUpdate(money, data.money);
                            if (accountcompany) {
                                console.log("creation status in change find histUpdateretuning", companyaccountHistoryUpda.data);
                                io.emit("validate_action", {
                                    status: 200,
                                    message: "success",
                                    error: null,
                                    data: await companyaccountsHistorys.findById(data._id)
                                });
                            }
                        }
                        else {
                            io.emit("validate_action", {
                                status: 400,
                                message: "error occured",
                                error: null,
                                data: null
                            });
                        }

                    }
                    else {
                        console.log("creation status in change find histUpdateretuningerror");
                        return io.emit("validate_action", {
                            status: 400,
                            message: "error occured",
                            error: null,
                            data: null
                        })
                    }
                } catch (error) {
                    console.log("creation status in change find histUpdateretuningerror exception", error);
                    return io.emit("validate_action", {
                        status: 500,
                        message: "error occured",
                        error: error,
                        data: null
                    })
                }
                // companyaccountFindAndUpdateOne
            }
        }





    });
};

module.exports = NotebookOperationSocket;