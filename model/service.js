const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true})

const serviceSchema = new mongoose.Schema({
    services: {
        type: String, 
        required: true,
        enum: ['Frontend', 'Backend', 'Search Engine Optimization(SEO)', 'Full stack', 'API integration $ development', 'E-commerce solutions', 'Software Localization'],
    },
    description: {type:String, required:true},
    mobile: {type: String, required:true},
    Email: { type: String, required:true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comments: [commentSchema],
}, {timestamps: true})


const Service = mongoose.model('Service', serviceSchema)
module.exports = Service;
