const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const historySchema = new schema({
    member_id: {
        type: String,
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
        type: String,
        required: true
    },
    bringby: {
        type: String,
        required: true
    },
    money_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    maxoperations:{
        type:Number,
        default:27
    },
    note_status:{
        type:String,
        default:"pending"
    }
});

module.exports = mongoose.model("histories", historySchema);