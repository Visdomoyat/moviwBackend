const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Service = require("../model/service.js")
const router = express.Router();
const mongoose = require('mongoose')

router.post('/', verifyToken, async (req, res) => {
    try {
        console.log("incoming request body:", req.body)
        if (!mongoose.isValidObjectId(req.user._id)) {
            return res.status(400).json({ error: "Inavalud author ID" })
        }
        req.body.author = req.user._id;
        const services = await Service.create(req.body);
        services._doc.author = req.user;
        res.status(201).json(services);
    } catch (err) {
        console.error("Error creating service:", err)
        res.status(500).json({ err: err.message })
    }
})

router.get("/", verifyToken, async (req, res) => {
    try {
        const services = await Service.find({author: req.user._id})
            .populate("author", 'username')
            .sort({ createdAt: -1 });
            console.log("User's Services:", services)
        res.status(200).json(services)
    } catch (err) {
        console.error("Database query error:", err)
        res.status(500).json({ errr: err.message })
    }
})

router.get("/:serviceId", verifyToken, async (req, res) => {
    try {
        const { serviceId } = req.params
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({ err: "Invalid service ID format" });
        }

        const service = await Service.findById(serviceId)
        .populate("author", "username")
        .populate("comments.author", "username");

        if(!service) {
            return res.status(404).json({error:"Service not found"})
        }

        console.log("Service data being sent:", service)

       
        res.status(200).json(service);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
});

router.put("/:serviceId", verifyToken, async (req, res) => {
    try {

        const service = await Service.findById(req.params.serviceId);

        if (!service.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");

        }


        const updatedService = await Service.findByIdAndUpdate(
            req.params.serviceId,
            req.body,
            { new: true }
        );


        updatedService._doc.author = req.user;


        res.status(200).json(updatedService)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})
router.delete("/:serviceId", verifyToken, async (req, res) => {
    try {
        const service = await Service.findById(req.params.serviceId);
       
        if (!service.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");
        }

        const deletedService = await Service.findByIdAndDelete(req.params.serviceId);
        re.status(200).json(deletedService);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.post("/:serviceId/comments", verifyToken, async (req, res) => {
    try {
        console.log("Received comment data:", req.body);
        
        req.body.author = req.user._id;
        const service = await Service.findById(req.params.serviceId);

        if (!service) {
            console.log("Service not found!");  
            return res.status(404).json({ error: "Service not found" });
        }

        service.comments.push(req.body);
        await service.save();

        const newComment = service.comments[service.comments.length - 1];
        newComment._doc.author = req.user;

        console.log("New comment saved:", newComment); 

        res.status(201).json(newComment);
    } catch (err) {
        console.error("Error creating comment:", err);
        res.status(500).json({ err: err.message });
    }
});


   
module.exports = router