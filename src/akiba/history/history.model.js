const { UUID } = require("mongodb");
const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const notebookOperationSchema = new schema({
    uuid:{
        type:String,
        default:UUID.generate(),
        required:false
    },
    member_id: 
        {
        type: Map,
        required: true
        }
    ,
    notebook: {
        type: String,
        required: true
    },
    collecter: {
        type: String,
        required: true,
    },
    account: {
        type: String,
        required: true,
    },
    done_by: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    money_id:{
        type:String,
        required:true
    },
    observation:{
        type:String,
        required:false
    },
    type_operation:{
        type:String,
        required:true
    },
    done_at:{
        type:Date,
        required:true
    }
});

module.exports = mongoose.model("notebooks_operations", notebookOperationSchema);