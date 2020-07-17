if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
app.use(express.static(__dirname + '/public'));
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash');
const session = require('express-session')
const http = require('http');
const url = require('url');

var errormessage = 'Invalid Username/password'

const initializePassport = require('./passport-config')
const { response } = require('express')
initializePassport(
    passport, 
    username =>  users.find(user => user.username === username)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.render('login.ejs')   
})

app.post('/validate',(req,res) => {
    http.get("docker-login-homepage2.mongodemoproj.svc:8080/getUser?name="+req.body.username, (resp) => {      
        let data = {};
            resp.on("data",(chunk) => {
                data = JSON.parse(chunk.toString());
                console.log(data);
                if(data.name == req.body.username && data.password ==req.body.password){
                    console.log('**valid')
                    res.render('homepage.ejs', {username:req.body.username})
                    } 
                    else {
                        res.render('login.ejs',{ errormessage: errormessage});
                    }
            })                    
      })
      .on("error", (err) => {
        console.log("Error: " + err.message);
      });
})
app.listen(3000)