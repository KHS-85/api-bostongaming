const express = require('express')
const router = express.Router()
const Product = require('../models/product.model')


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

// GET - SEARCH for products
router.get('/search/:searchword?', async (req, res) => {
    console.log("Henter alle produkter ud fra søgning", req.params.searchword)
    try {

        let searchword = ""
        if (req.params.searchword) {
            searchword = req.params.searchword
        }

        const products = await Product.find({
            // søg i overskrift og beskrivelse.
            // regex gør at den ikke søger efter præcis den sætning, men bare at ordet indgår
            // options "i" gør at den ikke er case-sensitive
            $or: [
                {"overskrift": {"$regex": req.params.searchword, "$options": "i"}},
                {"beskrivelse": {"$regex": req.params.searchword, "$options": "i"}}
            ]
        })

        res.json(products)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

})

// Getting all
router.get('/', async (req, res) => {
    console.log("Henter alle produkter fra databasen")
    try {
        const products = await Product.find()
        res.json(products)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

})



// Getting one by ID
router.get('/:id', getProduct, (req, res) => {
    res.json(res.product)
})

// Creating one // der kommer en fil/billede med, så derfor multer som middleware (upload)
router.post('/admin', upload.single('billede'), async (req, res) => {

    console.log("POST - product posted to database")

    // const product = new Product({
    //     overskrift: req.body.overskrift,
    //     beskrivelse: req.body.beskrivelse
    // })
    let product = new Product(req.body)
    req.file ? product.billede = req.file.filename : null // filnavn hentes fra Multer og gemmes i databasen
    // Turnery expression sørger for at den kan håndtere både med og uden billede

    try {
        const newProduct = await product.save()
        res.status(201).json({ message: "nyt produkt er oprettet", produktet: newProduct })
    }

    catch (err) {
        console.log("FEJL", err)
        res.status(400).json({ message: err.message })
    }

})

// Updating one
router.put('/admin/:id', upload.single('billede'), getProduct, async (req, res) => { //req = input fra react eller postman //// res = output (kinda)
 
    console.log("PUT - produkt")
 
    try {
 
        const {overskrift, beskrivelse} = req.body
 
        res.product.overskrift = overskrift;
        res.product.beskrivelse = beskrivelse;
 
        // billede er måske ikke blevet rettet 
 
        if (req.file) {
 
            res.product.billede = req.file.filename
 
        }
 
        await res.product.save();
        res.status(200).json({ message: 'Produktet er rettet', rettet: res.product })


 
    } catch (error) {
 
        console.log("FEJL", error)
        res.status(400).json({ message: "fejl i oprettelse af produkt" })
 
    }


 
})

// // Deleting one // using middleware
// router.delete('/:id', getProduct, async (req, res) => {
//     console.log("Produkt slettet")
//     try {
//         await res.product.remove()
//         res.json({ message: 'Deleted Product' })
//     }
//     catch (err) {
//         res.status(500).json({ message: err.message})
//     }

// })


// Find by ID and delete (this way we dont need to use middleware)
router.delete('/admin/:id', async (req, res) => {
    console.log("Produkt slettet")

    await Product.findByIdAndDelete(req.params.id, function (error, deletedproduct) {

        if (error) {

            console.log(error.message)
            res.status(500).json({ message: "Product was not deleted" })

        } else {

            if (deletedproduct) {

                res.status(200).json({ message: "Product was deleted", RemovedProduct: deletedproduct })
            }
            else {
                return res.status(404).json({ message: 'No product with this ID exists' })
            }
        }

    })

})


// Har denne funktion som middleware, da den skal bruges 3 gange. Til at hente specifik produkt, slette og rette
async function getProduct(req, res, next) {
    console.log("find ud fra ID")
    let product
    try {
        product = await Product.findById(req.params.id)
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.product = product
    next() // for at gå videre i oprindlig funktion ellers hænger den her i middleware
}

module.exports = router