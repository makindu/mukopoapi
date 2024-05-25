const mongoose = require("mongoose");
const schema = require("mongoose").Schema;

const agencyMemberSchema = new schema({
    agency_id:{
        type: String,
        required :true
    },
    member_id:{
        type:String,
        required:true
    },
    affectedby:{
        type:String,
        required:true
    }
});

module.exports = mongoose.model("agencymembers",agencyMemberSchema);