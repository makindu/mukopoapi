const {agency} = require("../../../db.provider");
const AgencyController = {};

AgencyController.getAll = async (req, res)=>{
    try {
        const agencies = await agency.find({});
        res.status(200).send({
            message:"success",
            error:null,
            data:agencies
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

AgencyController.create = async (req, res) =>{
    if (
        !req.body.name || 
        !req.body.code
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
        const result = await agency.create(req.body);
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

AgencyController.getSingle = async (req, res) => {

    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "No data found", data:null});
      return;
    }
    try {
      const data = await agency.findById(req.params.id);
      res.status(200).send({ message: "success", error: null, data: data});
    } catch (error) {
      res
        .status(400)
        .send({ message: "error occured", error: error, data:null });
    }
  };

  AgencyController.update= async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
    
        let result = await agency.findByIdAndUpdate(req.params.id,req.body);
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
            data: await agency.findById(req.params.id) 
        });
    } catch (error) {
      res
        .status(500)
        .send({ message: "error", error: error, data: null });
    }
  }; 
  
  AgencyController.delete = async (req, res) => {
    if (!req.params.id) {
      res
        .status(400)
        .send({ message: "error", error: "any id provided", data: null });
      return;
    }
  
    try {
      
        let result = await agency.findByIdAndDelete(req.params.id);
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

module.exports = AgencyController;