require('dotenv').config() // for at kunne hente fra .env filen

const cors = require('cors')
const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true,  useUnifiedTopology: true })
mongoose.set('useCreateIndex', true); // collection.ensureIndex is deprecated. Use createIndexes instead.
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('// -> Connected to Database  <- //'))


// APP/Server //
app.use(cors( {credentials: true, origin: true} ))      // udfyldes når sessions tilføjes
app.use(express.json())                                 // mulighed for request i json-format
app.use(express.static('public'))                       // request efter statiske billeder, feks billeder, sendes til public folder
app.use(express.urlencoded({extended: true}))           // for at request.body kan håndteres


// Session
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

app.use(session({

    name: 'sid',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: db }),
    secret: 'qwertyuiop',
    cookie: {
        maxAge: 1000 * 60 * 60, // cookie levetid i milisekunder
        sameSite: 'strict',
        secure: false, // true hvis https
        httpOnly: true // kun adgang til cookie fra header og ikke fra javascsript
    }

}))


// Kræver login ------------------------------------------------
app.use('*/admin*', async(req, res, next) => {

    if (req.session && req.session.userID) {

        console.log("Login godkendt", req.session.userID)
        return next() // godkendt - fortsæt til admin-route

    } else {
        
        return res.status(401).json({ message: "du har ikke adgang" })
    }
} )



// ROUTES ------------------------------------------------------
app.use('/products', require('./routes/product.routes'))
app.use('/sliders', require('./routes/slider.routes'))
app.use('/abouts', require('./routes/about.routes'))
app.use('/users', require('./routes/user.routes'))
app.use('/login', require('./routes/login.routes'))

app.listen(process.env.PORT, () => console.log('// -> Server started <- // http://localhost:' + process.env.PORT))


// Index - evt til test
app.get('/', async (req, res) => {
    console.log("server here ... /get request recived - This is the route to 'root - ")
    res.send("<h1> Her er svar fra api'et :D </h1>")
})