const {team} = require("../../../db.provider");
const {user} = require("../../../db.provider");
const TeamController = {};

TeamController.getAll = async (req, res)=>{
    try {
        const teams = await team.find({});
        res.status(200).send({
            message:"success",
            error:null,
            data:teams
        });
    } catch (error) {
        res
        .status(500)
        .send({ 
            message: "error occured", 
            error: error,
            data:[]
        });
    }
}

TeamController.create = async (req, res) =>{
    if (!req.body.fullname || !req.body.chief) {
        res
        .status(400)
        .send({ 
            message: "fullname or chief required", 
            error: null,
            data:null
        });
    }

    try { 
        const result = await team.create(req.body);
        res.status(200).send({
            message:"success",
            error:null,
            data:result
        }); 
        //before creating check if the chief is really in the DB
        // const chiefsent = await user.findById(req.body.chief);
        // if (chiefsent) {
        //     const result = await team.create(req.body);
        //     res.status(200).send({
        //         message:"success",
        //         error:null,
        //         data:result
        //     }); 
        // }else{
        //     res.status(400).send({
        //         message:"chief not find",
        //         error:null,
        //         data:{}
        //     }); 
        // }      
    } catch (error) {
        res
        .status(500)
        .send({ 
            message: "error occured", 
            error: error,
            data:null 
        });
    }
}

TeamController.getSingle = async (req, res) => {

    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "No data found", data:null});
      return;
    }
    try {
        let users = [];
      const data = await team.findById(req.params.id);
      if (data.members) {
        data.members.forEach(async member =>  {
           member= await userdetail(member);
            console.log(member);
            // users.push(find);
        });
      }
      res.status(200).send({ message: "success", error: null, data: data,users:users});
    } catch (error) {
      res
        .status(400)
        .send({ message: "error occured", error: error, data:null });
    }
  };

  TeamController.update= async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any ID provided", data: null });
      return;
    }
  
    try {
    
        let result = await team.findByIdAndUpdate(req.params.id,req.body);
        if (!result) {
            res.status(404).send({ 
                message: "not found", 
                error: null, 
                data:null
            }); 
        }
        res.status(200).send({ 
            message: "success", 
            error: null, 
            data: await team.findById(req.params.id) 
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "error", error: error, data: null });
    }
  }; 
  
  TeamController.delete = async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any ID provided", data: null });
      return;
    }
  
    try {
      
        let result = await team.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).send({ 
                message: "not found", 
                error: null, 
                data:null
            }); 
        }
        res.status(200).send({ 
            message: "success", 
            error: null, 
            data:result
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "error", error: error, data: null });
    }
  };

  async function userdetail (userId){
    const query = {
        _id:userId};
        const result = await user.findOne(query);
    return result;
  }

module.exports = TeamController;