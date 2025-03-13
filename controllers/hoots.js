const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Hoot = require("../model/hoot.js")
const router = express.Router();
const mongoose = require('mongoose')

router.post('/', verifyToken, async (req, res) => {
    try {
        req.body.author = req.user._id;
        const hoot = await Hoot.create(req.body);
        hoot._doc.author = req.user;
        res.status(201).json(hoot);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})

router.get("/", verifyToken, async (req, res) => {
    try {
        const hoots = await Hoot.find({})
            .populate("author")
            .sort({ createdAt: "desc" });
        res.status(200).json(hoots)
    } catch (err) {
        res.status(500).json({ errr: err.message })
    }
})

router.get("/:hootId", verifyToken, async (req, res) => {
    try {
        const { hootId } = req.params
        if (!mongoose.Types.ObjectId.isValid(hootId)) {
            return res.status(400).json({ err: "Invalid hoot ID format" });
        }

        const hoot = await Hoot.findById(hootId).populate("author");

        console.log(hoot)

        if (!hoot) {
            return res.status(404).json({ err: "Hoot not found" })
        }
        res.status(200).json(hoot);
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
});

router.put("/:hootId", verifyToken, async (req, res) => {
    try {
        //find hoot
        const hoot = await Hoot.findById(req.params.hootId);
        //check permissions
        if (!hoot.author.equals(req.user._id)) {
            return res.status(403).send("You're not allowed to do that!");

        }

        //update hoot:
        const updatedHoot = await Hoot.findByIdAndUpdate(
            req.params.hootId,
            req.body,
            { new: true }
        );

        //append req.user to the authr property
        updatedHoot._doc.author = req.user;

        //issue Json response
        res.status(200).json(updatedHoot)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
})
router.delete("/:hootId", verifyToken, async (req, res) => {
    try {
        const hoot = await Hoot.findById(req.params.hootId);

        if (!hoot.author.equals(req.user._id)) {
            return res.status(403).send("You're not always to do that!");
        }

        const deletedHoot = await Hoot.findByIdAndDelete(req.params.hootId);
        re.status(200).json(deletedHoot);
    } catch (err) {
        res.status(200).json({ err: err.message })
    }

    router.post("/:hootId/comments", verifyToken, async (req, res) => {
        try {
            req.body.author = req.user._id;
            const hoot = await Hoot.findById(req.params.hootId);
            hoot.comments.push(req.body);
            await hoot.save();

            const newComment = hoot.comments[hoot.comments.length - 1];
            newComment._doc.author = req.user;
            res.status(201).json(newComment)
        } catch (err) {
            res.status(500).json({ err: err.message })
        }

    })

    router.get("/:hootId", verifyToken, async (req, res) => {
        try {
            const hoot = await Hoot.findById(req.params.hootId).populate([
                'author',
                'comments.author',
            ]);
            res.status(200).json(hoot);
        } catch(err) {
            res.status(500).json({err: err.message})
        }
    })
})
module.exports = router;