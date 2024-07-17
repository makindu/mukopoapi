
const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const notebookOperationSchema = new schema({
    uuid: {
        type: String,
        required: false
    },
    member:
    {
        type: Map,
        required: true
    }
    ,
    notebook: {
        type: Map,
        required: true
    },
    collecter: {
        type: String,
    },
    account: {
        type: String,
        required: true,
    },
    done_by: {
        type: Map,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    money: {
        type: String,
        required: true
    },
    observation: {
        type: String,
        required: false
    },
    type_operation: {
        type: String,
        // required: true
    },
    done_at: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model("notebooks_operations", notebookOperationSchema);