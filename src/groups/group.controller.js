const {group} = require("../../db.provider");
const bcript = require("bcrypt");
const GroupController = {};

GroupController.getAll = async (req, res)=>{
    try {
        const groups = await group.find({});
        res.status(200).send({
            message:"success",
            error:null,
            data:groups
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

GroupController.create = async (req, res) =>{
    if (!req.body.fullname || !req.body.createdby) {
        res
        .status(400)
        .send({ 
            message: "fullname or createdby required", 
            error: null,
            data:null
        });
    }

    try {
        if (req.body.password) {
            req.body.password=bcript.hashSync(req.body.password,10);
        }
   
        const result = await group.create(req.body);
        res.status(200).send({
            message:"success",
            error:null,
            data:result
        });
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

GroupController.getSinglegroup = async (req, res) => {

    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "No data found", data:null});
      return;
    }
    try {
      const data = await group.findById(req.params.id);
      res.status(200).send({ message: "success", error: null, data: data });
    } catch (error) {
      res
        .status(400)
        .send({ message: "error occured", error: error, data:null });
    }
  };

  GroupController.updategroup = async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any ID provided", data: null });
      return;
    }
  
    try {
        if (req.body.password) {
            req.body.password=bcript.hashSync(req.body.password,10);
        }
        let result = await group.findByIdAndUpdate(req.params.id,req.body);
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
            data: await group.findById(req.params.id) 
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "error", error: error, data: null });
    }
  }; 
  
  GroupController.deletegroup = async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any ID provided", data: null });
      return;
    }
  
    try {
      
        let result = await group.findByIdAndDelete(req.params.id);
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

module.exports = GroupController;