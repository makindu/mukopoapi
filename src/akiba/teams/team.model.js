const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const teamSchema = new schema({
    fullname:{
        type: String,
        required :[true,"please provide a full name"],
        unique:true
    },
    description:{
        type:String,
        required:false
    },
    chief:{
        type:String,
        required:true
    },
    members:{
        type:[],
        required:false,
        default:[]
    }
});

module.exports = mongoose.model("teams",teamSchema);