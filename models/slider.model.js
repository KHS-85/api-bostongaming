const mongoose = require('mongoose')

const sliderSchema = new mongoose.Schema({
    billede: {
        type: String,
        required: [true, "billede er nødvendig"]
    },
    alttext: {
        type: String,
        required: [true, "Alt text er nødvendig"]
    },
    active: {
        type: Boolean,
        default: true
    },
    oprettelsesdato: {
        type: Date,
        required: true,
        default: Date.now
    }
})

module.exports = mongoose.model('Slider', sliderSchema, 'Sliders') // sidste bestemmer plural