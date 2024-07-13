const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const notebookSchema = new schema({
    member: {
        type: Map,
        required: true
    },
    nature_id: {
        type: String,
        required: true
    },
    account_id: {
        type: String,
        required: true,
    },
    type_id: {
        type: String,
        required: true,
    },
    created_by: {
        type: Map,
        required: true
    },
    bringby: {
        type: String,
        required: true
    },
    money: {
        type: String,
        required: true
    },
    done_at: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    maxoperations: {
        type: Number,
        default: 27
    },
    note_status: {
        type: String,
        default: "pending"
    }
});

module.exports = mongoose.model("notebooks", notebookSchema);