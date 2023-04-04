const mongoose = require('mongoose');
const mongooseClient = require('./connectmonogose')
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const ejs = require('ejs');
const { body, validationResult } = require('express-validator')
app.use(bodyParser.urlencoded({ extended: true }));
mongooseClient();
const JWT_SECRET = "Rajveersirnameis$idhu"
var User;
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    phone: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

// Create a model based on the schema
const Contact = mongoose.model('Contact', contactSchema);

// Serve static files from the "public" directory
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.get('/', (req, res) => {
    res.send('rajveer singh ');
});

app.get('/contact', (req, res) => {
    res.render('contact.html');
});
app.post('/contact', [
    body('name').isLength({ min: 5 }),
    body('phone').isLength({ min: 10, max: 10 }),
    body('description').isLength({ min: 100, max: 200 }),
    body('email').isEmail(),
    // password must be at least 5 chars long

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        description: req.body.description
    });

    contact.save()
        .then(() => {
            console.log('Contact saved:', contact);
            res.send('Contact saved successfully');
        })
        .catch((error) => {
            console.log('Error saving contact:', error);
            res.send('Error saving contact');
        });
});
const signSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    password: {
        required: true,
        type: String,
    }
})
const SignUp = mongoose.model('SignUp', signSchema);
app.get('/signup', (req, res) => {
    res.render('signUp.html')
})

app.post('/signup', [
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password', 'Your password length min of 5 letters').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10)
    var sepass = await bcrypt.hash(req.body.password, salt);

    const sign = new SignUp({
        email: req.body.email,
        password: sepass,
    });
    sign.save()
        .then(() => {
            console.log('signup saved:', sign);
            res.send('You are signup ');
        })
        .catch((error) => {
            console.log('Error saving contact:', error);
            return res.send('Please Fill the Valid Credentials');
        });
    const data = {
        id: sign._id
    }
    User = sign.email;
    const jwtData = jwt.sign(data, JWT_SECRET)
    console.log(jwtData)

    console.log(sign._id)
    let a = sign._id.toString()
    console.log(a)


})
const loginSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/
    },
    password: {
        required: true,
        type: String,
    }
})
const Login = mongoose.model('SignUp ', loginSchema);
app.get('/login', (req, res) => {
    res.render('login.html')
})
app.post('/login', [
    body('email').isEmail(),
    // password must be at least 5 chars long
    body('password', 'Your password length min of 5 letters').isLength({ min: 5 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() });
    }
    const { MongoClient } = require('mongodb');
    const url = 'mongodb://127.0.0.1:27017/causmicwebsites';

    // Connect to the MongoDB database
    const { email, password } = req.body;
    // console.log(req.body.email)
    async function getUserByEmail(email) {
        try {

            const user = await SignUp.findOne({ email: email });
            if (!user) {
                console.log('User not found');
                return null;
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.send("please try to login with the correct credentials ")

            }
            const data = {
                id: user._id
            }

            const jwtData = jwt.sign(data, JWT_SECRET)
            console.log(jwtData);
            res.send("You are successfully login")
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    getUserByEmail(email);
})
// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
