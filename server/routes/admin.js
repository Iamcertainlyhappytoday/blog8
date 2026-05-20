const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/*  GET check login, guard cookie token */

const authorMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({ message: "Unauthorised "});
    }
    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next();
    }catch(error){
         return res.status(401).json({ message: "Unauthorised "});
    }
}



//Get admin  - login
router.get('/admin',async (req, res) =>  {
    try{
        const locals = { title:"Admin", description:"Admin working"  }      
        res.render('admin/logon',{locals, layout:adminLayout} );
    }catch(error){console.log(error)}   
});

//POST admin check login
router.post('/admin',async (req, res) =>  {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(401).json({message:"invalid credentials"})
        }
        const isUserPasswordValid = 
        await bcrypt.compare(password, user.password);
        if(!isUserPasswordValid){
            return res.status(401).json({ message: "invalid credentials"})
        }
        const token = jwt.sign({userId: user._id},jwtSecret );
       res.cookie('token', token, { httpOnly:true });
        res.redirect('/dashboard' );
    }catch(error){console.log(error)}   
});

//POST dashboard check login
router.get('/dashboard',authorMiddleware,  async (req, res) =>  {
    res.render('admin/dashboard');
});



//POST register
router.post('/register',async (req, res) =>  {
    try{
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password , 10);
      

        console.log(req.body)
    try{ 
        const user = await User.create({ username, password : hashedPassword})
        res.status(201).json({ message: "user created",user});
        }catch(error){if(error,code === 11000){
            res.status(409).json({ message : "username already in use"})
        }
        res.status(500).json({ message: "internal server error"})          
        }       
    }catch(error){console.log(error)}   
});
//save as reference
/*router.post('/admin',async (req, res) =>  {
    try{
        const {username, password} = req.body;
        if(req.body.username === 'admin' && req.body.password === 'password'  )
        {res.send("you are logged in") }else{
          res.send("wrong username or password")  
        }                 
    }catch(error){console.log(error)}   
});*/

