const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const companyaccountHistorySchema = new schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    operation: {
        type: String,
        required: true

    },
    type_operation: {
        type: String,

        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    done_by: {
        type: Map,
        required: true,
    },
    collecter: {
        type: Map,
        // required: true,
    },
    done_at: {
        type: String,
        required: true
    },
    money: {
        type: String,
        required: true
    },
    validation: {
        type: Boolean,
        default: false,

    },
    mouvment: {
        type: String,
        required: true
    },
    creation_status: {
        type: String,
        required: true
    },
    validated_by: {
        type: Map,
        // required: false
    },
    observation: {
        type: String,
        required: false
    },
});

module.exports = mongoose.model("companyaccountsHistory", companyaccountHistorySchema);