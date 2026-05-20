const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
/*router.get('', (req, res) =>  {
    res.send('res working from main')
});*/
router.get('',async (req, res) =>  {
    try{
        const locals = { title:"learning node.js for the backend with express",
            description:"very hard, difficult transition from html, backend vital requisite, is this it?" };          
        let perPage =10;
        let page = req.query.page || 1;
        const data = await Post.aggregate([ {$sort : {createdAt: -1}}])
       .skip(perPage * page  -perPage)
       .limit(perPage)
       .exec();
        const count = await Post.countDocuments();
        const nextPage = parseInt(page) +1;
        const hasNextPage =  nextPage <= Math.ceil(count / perPage);
        const prevPage = parseInt(page)-1;
        const hasPrevPage = parseInt(page)-1;
        res.render('index',{locals,
            data,
            current : page,
            nextPage: hasNextPage ? nextPage : null,
            prevPage:hasPrevPage? prevPage:null
        } );
    }catch(error){console.log(error)}   
});



/*DONEDONEDONE
function insertPostData(){    Post.insertMany([
    {title:"Building a blog", body: "This is the body \text"},
    {title:"Walking Trip", body: "This is a page"},
    {title:"Third", body:"This is a diary third"}    ])};
insertPostData();*/
router.get('/post/:id',async (req, res) =>  {
    try{ 
        let slug = req.params.id;
        const data=await Post.findById({_id : slug});
        const locals = {title: data.title,
        description:"inside the blogs"
            }        
        res.render('post',{locals,data} );
    }catch(error){console.log(error)}   
});

router.post('/search',async (req, res) =>  {
    try{         
        const locals = {title: "Search", description:"inside the blogs" }
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g , '');
        const data = await Post.find({
            $or:[
                {title:{ $regex: new RegExp(searchNoSpecialChar, 'i')}},
                {body:{ $regex: new RegExp(searchNoSpecialChar, 'i')}}
            ]
        })
        res.render('search',{locals,data} );
    }catch(error){console.log(error)}   
});



router.get('/about', (req, res) =>  {
    res.render('about');
});
router.get('/profile', (req, res) =>  {
    res.render('profile');
});

router.get('/dailydose', (req, res) =>  {
    res.render('dailydose');
});



module.exports = router
