const {typeaccount} = require("../../../db.provider");
const TypesAccountController = {};

TypesAccountController.getAll = async (req, res)=>{
    try {
        const typesaccounts = await typeaccount.find({});
        res.status(200).send({
            message:"success",
            error:null,
            data:typesaccounts
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

TypesAccountController.create = async (req, res) =>{
    if (
        !req.body.name || 
        !req.body.isgroup ||
        !req.body.typetransaction || 
        !req.body.isclosed 
    ) {
        res
        .status(400)
        .send({ 
            message: "fields required", 
            error: null,
            data:null
        });
    }

    try { 
        const result = await typeaccount.create(req.body);
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

TypesAccountController.getSingle = async (req, res) => {

    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "No data found", data:null});
      return;
    }
    try {
      const data = await typeaccount.findById(req.params.id);
      res.status(200).send({ message: "success", error: null, data: data});
    } catch (error) {
      res
        .status(400)
        .send({ message: "error occured", error: error, data:null });
    }
  };

  TypesAccountController.update= async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
    
        let result = await typeaccount.findByIdAndUpdate(req.params.id,req.body);
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
            data: await typeaccount.findById(req.params.id) 
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "error", error: error, data: null });
    }
  }; 
  
  TypesAccountController.delete = async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
      
        let result = await typeaccount.findByIdAndDelete(req.params.id);
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

module.exports = TypesAccountController;