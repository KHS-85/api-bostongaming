const mongoose = require('mongoose')

const aboutSchema = new mongoose.Schema({
    
    tekst: {
        type: String,
        required: [true, "tekst er nødvendig"]
    },
    location: {
        type: String,
        required: [true, "location er nødvendig"]
    },
    oprettelsesdato: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('About', aboutSchema) // sidste bestemmer plural