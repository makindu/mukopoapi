const {user} = require("../../db.provider");
const bcript = require("bcrypt");

const UserSocket = (io) =>{
   ion.on("create_user", async (data)=>{

    if (!data.fullname || !data.phone) {
        io.emit("create_user_error",{ 
             message: "fullname or phone required", 
             error: null,
             data:null
         });
     }
     
    try {

        if (data.password) {
            data.password=bcript.hashSync(data.password,10);
        }
        const result = await user.create(data);
       io.emit("creation_user",{
            status:200,
            message:"success",
            error:null,
            data:result
        });
    } catch (error) {
        io.emit("create_user_error",{
            status:500,
            message: "error occured", 
            error: error,
            data:null 
        });
    }
   });
};

module.exports = UserSocket;