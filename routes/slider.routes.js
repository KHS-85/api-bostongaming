const express = require('express')
const router = express.Router()
const Slider = require('../models/slider.model')

// Multer - til upload af filer/billeder
const multer = require('multer')

const upload = multer({

    storage: multer.diskStorage({

        destination: function (req, file, cb) {
            cb(null, 'public/images')
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
})


// Getting all
router.get('/', async (req, res) => {
    console.log("Henter alle sliderer fra databasen")
    try {
        const sliders = await Slider.find()
        res.json(sliders)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

})


// Getting one by ID
router.get('/:id', getSlider, (req, res) => {
    res.json(res.slider)

})

// Creating one // der kommer en fil/billede med, så derfor multer som middleware (upload)
router.post('/', upload.single('billede'), async (req, res) => {

    console.log("POST - slider posted to database")

    // const slider = new Slider({
    //     overskrift: req.body.overskrift,
    //     beskrivelse: req.body.beskrivelse
    // })
    let slider = new Slider(req.body)
    req.file ? slider.billede = req.file.filename : null // filnavn hentes fra Multer og gemmes i databasen
    // Turnery expression sørger for at den kan håndtere både med og uden billede

    try {
        const newSlider = await slider.save()
        res.status(201).json({ message: "nyt slider er oprettet", slideret: newSlider })
    }

    catch (err) {
        console.log("FEJL", err)
        res.status(400).json({ message: err.message })
    }

})

// Updating one
router.patch('/:id', upload.single('billede'), getSlider, async (req, res) => { //req = input fra react eller postman //// res = output (kinda)
 
    console.log("PUT - slider")
 
    try {
 
        const alttext = req.body
 
        res.slider.alttext = alttext;
 
        // billede er måske ikke blevet rettet 
 
        if (req.file) {
 
            res.slider.billede = req.file.filename
 
        }
 
        await res.slider.save();
        res.status(200).json({ message: 'Produktet er rettet', rettet: res.slider })


 
    } catch (error) {
 
        console.log("FEJL", error)
        res.status(400).json({ message: "fejl i oprettelse af slider" })
 
    }


 
})


// Find by ID and delete (this way we dont need to use middleware)
router.delete('/:id', async (req, res) => {
    console.log("Produkt slettet")

    await Slider.findByIdAndDelete(req.params.id, function (error, deletedslider) {

        if (error) {

            console.log(error.message)
            res.status(500).json({ message: "Slider was not deleted" })

        } else {

            if (deletedslider) {

                res.status(200).json({ message: "Slider was deleted", RemovedSlider: deletedslider })
            }
            else {
                return res.status(404).json({ message: 'No slider with this ID exists' })
            }
        }

    })

})


// Har denne funktion som middleware, da den skal bruges 3 gange. Til at hente specifik slider, slette og rette
async function getSlider(req, res, next) {
    console.log("find ud fra ID")
    let slider
    try {
        slider = await Slider.findById(req.params.id)
        if (slider == null) {
            return res.status(404).json({ message: 'Cannot find slider' })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.slider = slider
    next() // for at gå videre i oprindlig funktion ellers hænger den her i middleware
}

module.exports = router