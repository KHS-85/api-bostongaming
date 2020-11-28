const express = require('express')
const router = express.Router()
const About = require('../models/about.model')

// Uden billeder - form-data - kræver: npm install express-form-data
const formData = require('express-form-data')
router.use(formData.parse())

// Getting all
router.get('/', async (req, res) => {
    console.log("Henter alle produkter fra databasen")
    try {
        const abouts = await About.find()
        res.json(abouts)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

})


// Getting one by ID
router.get('/:id', getAbout, (req, res) => {
    res.json(res.about)
})


// Creating one
router.post('/admin', async (req, res) => {

    console.log("POST - about posted to database")

    const about = new About({
        tekst: req.body.tekst,
        location: req.body.location,
    })

    try {
        const newAbout = await about.save()
        res.status(201).json({ message: "nyt about er oprettet", produktet: newAbout })
    }

    catch (err) {
        console.log("FEJL", err)
        res.status(400).json({ message: err.message })
    }

})

// Updating one
router.put('/admin/:id', getAbout, async (req, res) => { //req = input fra react eller postman //// res = output (kinda)
 
    console.log("PUT - about")
 
    try {
 
        const {location, tekst} = req.body
 
        res.about.location = location;
        res.about.tekst = tekst;
 
        await res.about.save();
        res.status(200).json({ message: 'About er rettet', rettet: res.about })

        console.log("About er blevet ændret")


 
    } catch (error) {
 
        console.log("FEJL", error)
        res.status(400).json({ message: "fejl i oprettelse af about" })
 
    }


 
})

// Har denne funktion som middleware, da den skal bruges 3 gange. Til at hente specifik about, slette og rette
async function getAbout(req, res, next) {
    console.log("find ud fra ID")
    let about
    try {
        about = await About.findById(req.params.id)
        if (about == null) {
            return res.status(404).json({ message: 'Cannot find about' })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.about = about
    next() // for at gå videre i oprindlig funktion ellers hænger den her i middleware
}

module.exports = router