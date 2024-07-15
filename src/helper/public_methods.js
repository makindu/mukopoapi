const { notebookoperation, notebook, componyaccounts, companyaccountsHistorys, account } = require("../../db.provider");
const { generatePrefixedUUID, generateRandomString } = require("../helper/uuid");

async function notbookexist(data) {
    try {

        let existingNotbook = await notebook.findOne({ _id: data.notebook._id });
        if (existingNotbook) {
            return {
                message: true,
                error: null,
                data: existingNotbook
            }
        }
        else {
            return {
                message: false,
                error: "data not found",
                data: null
            }
        }
    } catch (error) {
        return {
            message: false,
            error: error,
            data: null
        }
    }

}
async function accountexist(data) {
    try {

        let existingAccount = await account.findOne({ _id: data.account });

        if (existingAccount) {
            return {
                message: true,
                error: null,
                data: existingAccount
            }
        }
        else {
            return {
                message: false,
                error: "data not found",
                data: null
            }
        }
    } catch (error) {
        return {
            message: false,
            error: error,
            data: null
        }
    }

}
async function notbookUpdated(existingNotbook, newDataNotbook) {
    try {
        let notebookUpdated = await notebook.findByIdAndUpdate(existingNotbook.data._id, newDataNotbook);
        if (notebookUpdated) {
            return {
                message: true,
                error: null,
                data: notebookUpdated
            }
        }
        else {
            return {
                message: false,
                error: "data not found",
                data: null
            }
        }
    } catch (error) {
        return {
            message: false,
            error: error,
            data: null
        }

    }
}
async function historyMemberPassed(data, resultat) {
    try {
        let historySaved = await notebookoperation.create(data);
        if (historySaved) {
            return {
                message: true,
                error: null,
                data: historySaved
            }
        }
        else {
            return {
                message: false,
                error: "data not found",
                data: null
            }
        }

    } catch (error) {
        return {
            message: false,
            error: error,
            data: null
        }

    }

}
async function companyaccountFindAndUpdateOne(data) {
    try {

        let componyaccountsUpdated = await componyaccounts.findOne({ money: data.money });
        let newSold = data.amount;

        newSold += componyaccountsUpdated.sold;
        let companyaccount = {
            sold: newSold,
        };
        let resultat = await componyaccounts.findByIdAndUpdate(componyaccountsUpdated._id, companyaccount);
        if (resultat) {
            return {
                message: true,
                error: null,
                data: resultat
            }
        }
        else {
            return {
                message: false,
                error: "data not found",
                data: null
            }
        }
    } catch (error) {
        return {
            message: false,
            error: error,
            data: null
        }
    }
}
async function componyaccountsHistory(data, notebookoperation, notebookexist, type_operation) {
    try {

        console.log("passed creation object");
        let companyaccountsHistory = {
            uuid: generatePrefixedUUID('CAH'),
            operation: notebookoperation.data._id,
            money: data.money,
            type_operation: type_operation,
            amount: data.amount,
            done_by: data.done_by,
            done_at: data.done_at,
            mouvment: data.type_operation,
            observation: data.observation,
            creation_status: creation_status,
            sold_operation: notebookexist.data.sold_operation,
            validated_by: notebookoperation.data.created_by
        }
        console.log("accountHistoryIntiate");
        let companyaccountshistory = await companyaccountsHistorys.create(companyaccountsHistory);
        console.log("accountHistoryValidate");
        if (companyaccountsHistory) {
            console.log("passed");
            return {
                message: true,
                error: null,
                data: companyaccountshistory
            }
        }
        else {
            console.log("not passed");
            return {
                message: false,
                error: "data not found",
                data: null
            }
        }
    } catch (error) {
        console.log("not passed");
        return {
            message: false,
            error: error,
            data: null
        }
    }
}
module.exports = { notbookexist, accountexist, historyMemberPassed, companyaccountFindAndUpdateOne, notbookUpdated, componyaccountsHistory };

// try {
//     if (!data.uuid) {
//         data.uuid = generatePrefixedUUID('NH');
//     }
//     let existingNotbook = await notebook.findOne({ _id: data.notebook._id });
//     let existingAccount = await account.findOne({ _id: data.account });
//     if (existingNotbook.sold_operation == 0 || existingNotbook.note_status == "pending" || existingNotbook.note_status == "unavailable") {
//         console.log("notboook are unavalable");

//         return io.emit("new_notebook_operation", {
//             status: 400,
//             message: "book unavailable",
//             error: null,
//             data: null
//         });
//     }
//     console.log('tub finded', existingNotbook);
//     if (existingNotbook.amount == data.amount) {
//         let newDataNotbook = {
//             operation_done: existingNotbook.operation_done + 1,
//             sold_operation: existingNotbook.sold_operation - 1,
//         };
//         let notebookUpdated = await notebook.findByIdAndUpdate(existingNotbook._id, newDataNotbook);
//         if (notebookUpdated) {
//             let result = await notebookoperation.create(data);
//             if (existingNotbook.operation_done != 0 && result) {
//                 if (existingAccount && data.type_operation == 'entry') {
//                     let newSold = result.amount;
//                     newSold += existingAccount.sold;
//                     let newSoldeAccountMember = {
//                         sold: newSold
//                     }
//                     await account.findByIdAndUpdate(existingAccount._id, newSoldeAccountMember);

//                 }
//                 if (existingAccount && data.type_operation == 'withdraw') {
//                     let newSold = result.amount;
//                     newSold -= existingAccount.sold;
//                     let newSoldeAccountMember = {
//                         sold: newSold
//                     }
//                     await account.findByIdAndUpdate(existingAccount._id, newSoldeAccountMember);
//                 }
//                 if (existingNotbook.operation_done == 0) {
//                     let existingNotbook = await componyaccounts.findOne({ money: data.money });

//                     console.log('tub finded', existingNotbook);
//                     let newSold = result.amount;
//                     if (existingNotbook) {
//                         newSold += existingNotbook.sold;
//                     }
//                     creation_status = 'validated';
//                     let companyaccount = {
//                         sold: newSold,
//                     };
//                     await componyaccounts.findByIdAndUpdate(existingNotbook._id, companyaccount);


//                     let companyaccountsHistory = {
//                         uuid: generatePrefixedUUID('CAH'),
//                         operation: result._id,
//                         money: data.money,
//                         type_operation: 'deposit_book',
//                         amount: data.amount,
//                         done_by: data.done_by,
//                         done_at: data.done_at,
//                         mouvment: data.type_operation,
//                         observation: data.observation,
//                         creation_status: creation_status,
//                         sold_operation: existingNotbook.sold_operation - 1,
//                         validated_by: result.created_by
//                     }
//                     await companyaccountsHistorys.create(companyaccountsHistory);

//                 }
//                 return io.emit("new_notebook_operation", {
//                     status: 200,
//                     message: "success",
//                     error: null,
//                     data: result
//                 });
//             }
//         }
//     }
//     else {
//         console.log("amounts are not aquals");
//         io.emit("new_notebook_operation", {
//             status: 400,
//             message: "error occured",
//             error: error,
//             data: null
//         });
//     }

// } catch (error) {
//     console.log("error cactched " + error);
//     io.emit("new_notebook_operation", {
//         status: 500,
//         message: "error occured",
//         error: error,
//         data: null
//     });
// }