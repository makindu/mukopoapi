const { notebook, companyaccountsHistorys, componyaccounts } = require("../../../db.provider");
const { generatePrefixedUUID, generateRandomString } = require("../../helper/uuid");

async function creatingNotebook(data) {
    try {
        if (!data.uuid) {
            data.uuid = generatePrefixedUUID('NB')
        }
        let note_status = 'pending';
        if (data.created_by.type == 'manager') {
            note_status = 'validated';
        }
        data.note_status = note_status;
        data.sold = 0;
        const result = await notebook.create(data);
        if (result) {
            // console.log('result type',result.created_by.type); done_by
            let creation_status = 'pending';
            let validation = false;
            if (data.created_by.type == 'manager') {
                let existingAccount = await componyaccounts.findOne({ money: result.money });
                let newSold = result.amount;
                if (existingAccount) {
                    newSold += existingAccount.sold;
                }
                creation_status = 'validated';
                validation = true;
                // let companyaccount = {
                //     sold: newSold,
                // };
                // await componyaccounts.findByIdAndUpdate(existingAccount._id, companyaccount);
            }

            let companyaccountsHistory = {
                uuid: generatePrefixedUUID('CAH'),
                operation: result._id,
                money: result.money,
                type_operation: 'created_book',
                amount: result.amount,
                done_by: result.created_by,
                done_at: result.done_at,
                mouvment: 'entry',
                collecter: data.bringby,
                validation: validation,
                observation: data.observation,
                creation_status: creation_status,
                sold_operation: result.sold_operation,
                validated_by: result.created_by
            }
            console.log(companyaccountsHistory);


            await companyaccountsHistorys.create(companyaccountsHistory);
            if (companyaccountsHistorys) {
                return {
                    'message': "success",
                    'data': result,
                    'error': null
                };
            } else {
                return {
                    'message': "error occured",
                    'data': null,
                    'error': null

                }
            }
        } else {
            return {
                'message': "error occured",
                'data': null,
                'error': null

            }
        }
    } catch (error) {
        return {
            'message': "error occured",
            'data': null,
            'error': error
        };

    }

}
module.exports = creatingNotebook;
