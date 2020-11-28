const express = require('express')
const router = express.Router()
const User = require('../models/user.model')

// Uden billeder - form-data - kræver: npm install express-form-data
const formData = require('express-form-data')


// GET - SEARCH for users
router.get('/search/:searchword?', async (req, res) => {
    console.log("Henter alle users ud fra søgning", req.params.searchword)
    try {

        let searchword = ""
        if (req.params.searchword) {
            searchword = req.params.searchword
        }

        const users = await User.find({
            // søg i navn og email.
            // regex gør at den ikke søger efter præcis den sætning, men bare at ordet indgår
            // options "i" gør at den ikke er case-sensitive
            $or: [
                {"email": {"$regex": req.params.searchword, "$options": "i"}},
                {"name": {"$regex": req.params.searchword, "$options": "i"}}
            ]
        })
        res.json(users)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

})

// Getting all
router.get('/', async (req, res) => {
    console.log("Henter alle users fra databasen")
    try {
        const users = await User.find()
        res.json(users)
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }

})





// Getting one by ID
router.get('/:id', getUser, (req, res) => {
    res.json(res.user)

})

// Creating one // POST
router.post('/', async (req, res) => {

    console.log("POST - user posted to database")

    try {
        let user = new User(req.body)
        const newUser = await user.save()
        res.status(201).json({ message: "ny user er oprettet", user: newUser })
    }

    catch (err) {
        console.log("FEJL", err)
        res.status(400).json({ message: err.message })
    }

})

// Updating one
router.patch('/:id', getUser, async (req, res) => { //req = input fra react eller postman //// res = output (kinda)
 
    console.log("PUT - user")
 
    try {
 
        const {email, navn} = req.body
 
        res.user.email = email;
        res.user.navn = navn;
 
        await res.user.save();
        res.status(200).json({ message: 'Produktet er rettet', rettet: res.user })


 
    } catch (error) {
 
        console.log("FEJL", error)
        res.status(400).json({ message: "fejl i oprettelse af user" })
 
    }


 
})

// // Deleting one // using middleware
// router.delete('/:id', getUser, async (req, res) => {
//     console.log("Produkt slettet")
//     try {
//         await res.user.remove()
//         res.json({ message: 'Deleted User' })
//     }
//     catch (err) {
//         res.status(500).json({ message: err.message})
//     }

// })

// Find by ID and delete (this way we dont need to use middleware)
router.delete('/:id', async (req, res) => {
    console.log("Produkt slettet")

    await User.findByIdAndDelete(req.params.id, function (error, deleteduser) {

        if (error) {

            console.log(error.message)
            res.status(500).json({ message: "User was not deleted" })

        } else {

            if (deleteduser) {

                res.status(200).json({ message: "User was deleted", RemovedUser: deleteduser })
            }
            else {
                return res.status(404).json({ message: 'No user with this ID exists' })
            }
        }

    })

})


// Har denne funktion som middleware, da den skal bruges 3 gange. Til at hente specifik user, slette og rette
async function getUser(req, res, next) {
    console.log("find ud fra ID")
    let user
    try {
        user = await User.findById(req.params.id)
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user' })
        }
    }
    catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.user = user
    next() // for at gå videre i oprindlig funktion ellers hænger den her i middleware
}

module.exports = router