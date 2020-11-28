const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    overskrift: {
        type: String,
        required: [true, "Produktets overskrift er nødvendig"]
    },
    beskrivelse: {
        type: String,
        required: [true, "Produktets beskrivelse er nødvendig"]
    },
    billede: {
        type: String,
        default: "paavej.png" // hvis der ikke bliver sendt noget med // dog måske ikke den bedste løsning (bedre når det loopes ud)
    },
    oprettelsesdato: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Product', productSchema, 'Products') // sidste bestemmer plural