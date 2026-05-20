require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');
const cookieParser = require('cookie-parser');

const session = require('express-session')
const app =express();
const PORT = 5000// || process.env.PORT;//the one of the online resource hoster
connectDB();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
const MongoStore = require('connect-mongo');
const User = require('./server/models/User');
app.use(session({
    secret:'kirknewton',
    resave: false, 
    saveUninitialized : true, 
    //store:process.env.MONGOBB_URI, cookie:
      function(req) {
    var match = req.url.match(/^\/([^/]+)/);
    return {
      path: match ? '/' + match[1] : '/',
      httpOnly: true,
      secure: req.secure || false,
      maxAge: 60000
    }
  } }));

app.use(express.static('public'));
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use('/',require('./server/routes/main'))
app.use('/',require('./server/routes/admin'))

app.listen(PORT, () => {
    console.log(`app listens on ${PORT}`);
})
