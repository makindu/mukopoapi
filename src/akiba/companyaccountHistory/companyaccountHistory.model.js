const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const companyaccountHistorySchema = new schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    operation: {
        type: Map,
        of: {
            type: String,
        },
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
        of: {
            type: String,
        },
        required: true,
    },
    done_at: {
        type: String,
        required: true
    },
    validation: {
        type: Boolean,

    },
    mouvment: {
        type: String,
        required: true
    },
    valideted_by: {
        type: String,
        default: 0,
        required: true
    }
});

module.exports = mongoose.model("companyaccountsHistory", companyaccountHistorySchema);