// const express = require('express')
// const router = express.Router()
// const About = require('../models/about.model')

// // Uden billeder - form-data - kræver: npm install express-form-data
// const formData = require('express-form-data')


// // Getting one (the *only* one)
// router.get('/', async (req, res) => {
//     console.log("Henter about fra databasen")

//     About.findOne(null, function (error, about) {

//         if (error) {
//             console.log("ERROR", error)
//             res.status(500).json({ message: err.message })
//         }
//         else {
//             res.status(200).json(about)
//         }
//     })
// })

// // Updating one (the *only* one)
// router.put('/', async (req, res) => {

//     console.log("PUT - about")

//     // new; true betyder at man får det rettede dokument tilbage... default er false
//     About.findOneAndUpdate(null, { tekst: req.body.tekst }, {new: true, useFindAndModify: false}, function (error, about) {

//         if (error) {
//             res.status(400).json({ message: "fejl i oprettelse af about", error: error })
//         }
//         else {
//             res.status(200).json({ message: "About tekst er rettet", rettet: about })
//         }

//     })

// })


// // Midlertidig POST

// router.post('/', async (req, res) => {
//     const about = new About({
//         tekst: req.body.tekst
//     })

//     try {
//         const newAbout = await about.save()
//         res.status(201).json(newAbout)
//     }

//     catch (err) {
//         res.status(400).json({ message: err.message })
//     }

// })

// module.exports = router