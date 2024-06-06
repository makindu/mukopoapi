const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const companyaccountSchema = new schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    manager: {
        type: Map,
        of: {
            type: String,
        },
        required: true
    },
    money_id: {
        type: String,
        required: true
    },
    in_transaction: {
        type: Map,
        of: {
            type: String
        },
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model("companyaccounts", companyaccountSchema);