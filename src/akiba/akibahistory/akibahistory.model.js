const mongoose = require("mongoose");
const generatePrefixedUUID = require("../../helper/uuid");
const schema = require("mongoose").Schema;

const akibaHistorySchema = new schema({
    uuid: {
        type: String,
        default: generatePrefixedUUID('RAS'),
        required: false
    },
    member:
    {
        type: Map,
        required: true
    }
    ,
    nature: {
        type: String,
        require: true
    },
    type_operation: {
        type: String,
        required: true
    },
    notebook: {
        type: Map,
        required: false
    },
    account: {
        type: Map,
        required: false,
    },
    done_by: {
        type: Map,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    money_id: {
        type: String,
        required: true
    },
    observation: {
        type: String,
        required: false
    },
    done_at: {
        type: Date,
        required: true
    },
    isvalidated: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("akibaHistories", akibaHistorySchema);