const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const notebookSchema = new schema({
   member_id:{
        type:String,
        required:true
    },
    nature_id:{
        type:String,
        required:true
    },
    type_id:{
        type:String,
        required:true,
    },
    created_by:{
        type:String,
        required:true
    },
    bringby:{
        type:String,
        required:true
    },
    money_id:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    }
});

module.exports = mongoose.model("notebooks",notebookSchema);