const {Schema, model} = require('mongoose')


const bookSchema = new Schema({
    id: {
        type: String,
    },
    title: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        default: "",
    },
    author: {
        type: String,
        default: "",
    },
    favourite: {
        type: String,
        default: "",
    },
    fileCover: {
        type: String,
        default: "",
    },
    fileName: {
        type: String,
        default: "",
    },
    views: {
        type: Number,
        default: 0,
    },
})

module.exports = model('Book', bookSchema)