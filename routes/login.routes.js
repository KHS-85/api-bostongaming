// Metoder til at håndtere login, logout + "er jeg logget ind"

const User = require('../models/user.model')

const express = require('express')
const router = express.Router()

const formData = require('express-form-data')
router.use(formData.parse())

// Login - login med email og password

router.post('/login', async (req, res) => {

    console.log("LOGIN", req.body)

    try {

        const user = await User.findOne({ email: req.body.email })

        if (!user) return res.status(401).json({ message: "Bruger findes ikke" })

        // sammenlign password

        user.comparePassword(req.body.password, function (error, passwordsmatch) {

            // hvis der er en fejl så return fejlen
            if (error) return res.status(200).json({ message: error.message })
            console.log(error)

            // COOKIE HER!!! her håndterer vi om der er match eller ej på password
            if (passwordsmatch) {

                req.session.userID = user._id
                res.status(200).json({ name: user.name, userID: user._id })
            }
            else {
                res.status(401).json({ message: "Login afvist" })
            }

        })


    } catch (error) {

        res.status(500).json({ message: error.message })

    }
})


// Logout

router.get('/logout', async (req, res) => {

    req.session.destroy(error => {

        // hvis der er en fejl
        if(error) return res.status(500).json({ message: "Logud mislykkedes - prøv igen"})

        // hvis der ikke er en fejl fortsættes til denne
        res.clearCookie('sid').json({ message: "Success! - Cookie er slettet"})
    })
})


//  Er jeg (stadig) logged ind?

router.get('/loggedin', async (req, res) => {

    if (req.session.userID) {

        return res.status(200).json({ message: "login er stadig aktiv", status: true})
    }
    else {

        return res.status(401).json({ message: "login eksisterer ikke eller er udløbet", status: false})
    }
    
})



module.exports = router