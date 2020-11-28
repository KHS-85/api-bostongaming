const mongoose = require('mongoose')

// Kryptering af password
let bcrypt = require('bcrypt')
const SALT_FACTOR = 5           // hvor mange gange 'kortene skal blandes' - højere værdi kræver mere CPU kraft / længere tid


const userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "brugerens email er nødvendig"],
        trim: true,             // fjerne whitespace før og efter strengen
        lowercase: true,        // gemmer som lowercase lige meget om der er indtastet store bogstaver
        index: { unique: true }   // checker om der allerede eksisterer dette i databasen før den oprettes
    },
    password: {
        type: String,
        required: [true, "brugerens password er nødvendig"],
        minlength: [6, 'Password skal være minimum 6 tegn']
    },
    name: {
        type: String,
        required: [true, "brugerens navn er nødvendig"],
        minlength: [2, 'Navn skal være minimum 2 tegn']
    },
    oprettelsesdato: {
        type: Date,
        required: true,
        default: Date.now
    }
})


// inden gem/save user, så krypter password
userSchema.pre('save', function (next) {

    let user = this // den user som det lige nu handler  om - den som skal saves

    // Hvis user gemmes uden at password er ændret - så "next" altså forlad pre.save - dvs kryptering ikke er nødvendig
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(SALT_FACTOR, function (error, salt) {

        if (error) return next(error)  // hvis der er en fejl, så hop ud af metoden og tag fejlbeskeden med

        bcrypt.hash(user.password, salt, function (error, hash) {

            if (error) return next(error)

            // Alt gik godt og det lykkedes!
            user.password = hash
            next() // færdig - posen er rystet med hemmelig salt og et krypteret password er skabt

        })
    })
})


// Metode som kan kryptere et password og sammenligne det med et (krypteret) password i databasen
userSchema.methods.comparePassword = function(postedpassword, cb) {

    console.log("Password sammenlignes")

    bcrypt.compare(postedpassword, this.password, function(error, passwordmatches) {

        if (error) return cb(error) // fortsæt i oprindelig metode og send fejlen med

        // password kunne sammenlignes - hvis true = ens - hvis fale = ikke ens
        cb(null, passwordmatches)
        
    })
}

module.exports = mongoose.model('User', userSchema, 'users') // sidste bestemmer plural