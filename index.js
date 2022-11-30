const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./models/User')
const Notes = require('./models/Notes')
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');



const uri = "mongodb+srv://sachin:sachin@cluster0.nhcktwt.mongodb.net/alpha?retryWrites=true&w=majority"

mongoose.connect(uri)
    .then(()=> console.log("connected") )
    .catch((err) => { console.log(err) })



app.get("/", (req, res) => {
    res.send("hello")
})

app.use(passport.initialize());
require("./passport.js")(passport)
app.use(express.json());
app.post('/addUser',[
    check('email', 'Email length should be 10 to 30 characters')
                    .isEmail().isLength({ min: 10, max: 30 }),
    check('password', 'Password length should be 8 to 10 characters')
                    .isLength({ min: 5, max: 10 })
], async (req,res)=>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json(errors)
    }
    // const name=req.body.name
    // const email=req.body.email
    // const password=req.body.password

    const newUser=new User({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password

    })

    bcrypt.genSalt(10,async (err,salt)=>{
        bcrypt.hash(newUser.password,salt,async (err,hash)=>{
            if (err){
                throw err
            }
            newUser.password=hash
            try{
                await newUser.save()
                res.send(newUser)
            }
            catch(err){
                res.status(400).json({
                    "key error":err
                })
            }
        })
    })

    // bcrypt.hash(newUser.password, 10, (err, hash) => {
    //     if (err) throw err;
    //     newUser.password = hash;
    //     newUser
    //       .save()
    //       .then(user => res.json(user))
    //       .catch(err => console.log(err));
    //   });
    // });

    // try{
    //     await newUser.save()
    //     res.send(newUser)
    // }
    // catch{
    //     //console.log("err")
    //     res.status(400).send("error")
    // }
    // newUser.save()
    // .then(res.send("new user added"))

    // catch(err){
    //     res.status(400).json({
    //         "key error":err
    //     })
    // }

})


// app.post('/addNotes', async (req, res) => {
//     const newNotes = new Notes({
//         title: req.body.title,
//         description: req.body.description,
//         tag: req.body.tag

//     })

//     try {
//         await newNotes.save()
//         res.send(newNotes)
//     }
//     catch (err) {
//         res.status(400).json({
//             "key error": err
//         })
//     }

// })

app.get("/getUser",async (req,res)=>{
    const email=req.body.email
    let foundUser=null
    try{
        foundUser=await User.find({
            "email":email
        })
    }
    catch(err){
        console.log("error")
    }
    if (foundUser.length==0){
        return res.status(404).json("user not found")
    }
    res.send(foundUser)
})


app.post('/login',async(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    let foundUser=null
    try{
        foundUser=await User.findOne({
            "email":email
        })
    
    }
    catch(err){
        console.log("error")
    }
    if (!foundUser){
        return res.status(404).json({
            "msg":"user not found"
        })
    }
    try{
        const match = await bcrypt.compare(password,foundUser.password)
        if (!match){
            return res.status(404).json({
                "msg":"login with correct credentials"
            })
        }
        const payload = {
            "name":foundUser.name,
            "email":foundUser.email,
            "id":foundUser._id
        }
        jwt.sign(
            payload,
            "sachin",
            {expiresIn:10000},
            (err,token)=>{
                res.send(token)
            }
        )

    }


    catch(err){
        console.log(err)
    }
    
    
})

app.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json(req.user)
})

app.get('/getall',async (req,res)=>{
    let alluser=[]
    try{
        alluser=await User.find()
    }
    catch(err){
        return res.status(500).json({
            "msg":"server errror"
        })
    }
    if (alluser.length===0){
        return res.status(404).json({
            "msg":"no user found"
        })
    }
    res.send(alluser)
})

app.post('/addNotes',passport.authenticate('jwt',{session:false}), async(req,res)=>{
    const newNotes=new Notes({
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
        user: req.user.id
    })
    try{
        await newNotes.save()
        res.send(newNotes)
    }
    catch(err){
        return res.status(400).json({
            "msg":"data didn't stored"
        })
    }      
    
})

app.get('/notes/:notesid', async(req,res)=>{
    const id=req.params.notesid
    let notes=null
    try{
        notes=await Notes.findById(id)
    }
    catch(err){
        return res.status(400).json({
            "msg":"database fault"
        })
    }
    if (!notes){
        return res.status(404).json({
            "msg":"notes not found"
        })
    }
    res.send(notes)
})

app.get('/userNotes/:userid',async(req,res)=>{
    const id=req.params.userid
    let notes=[]
    try{
        notes=await Notes.find({
            "user":id
        })
    }
    catch(err){
        return res.status(400).json({
            "err":err.message
        })
    }
    if (notes.length===0){
        return res.status(404).json({
            "err":"notes doesn't found"
        })
    }
    res.send(notes)
})

app.get('/current/notes',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const id=req.user.id
    let notes=[]
    try{
        notes= await Notes.find({
            "user":id
        })
    }
    catch(err){
        return res.status(400).json({
            "err":err.message
        })
    }
    if (notes.length==0){
        return res.status(400).json({
            "err":"notes doesn't found"
        })
    }
    res.send(notes)
})

app.delete('/delete/:notesid',passport.authenticate('jwt',{session:false}), async(req,res)=>{
    const userid=req.user.id
    const notesid=req.params.notesid
    let foundnotes=null
    try{
        foundnotes=await Notes.findById(notesid)
    }
    catch(err){
        return res.status(400).json({
            "err":err.message
        })
    }
    if (!foundnotes){
        return res.status(404).json({
            "err":"notes not found"
        })
    }

    if (userid!==String(foundnotes.user)){
        return res.send("this post doesn't belong to user")

    }
    await foundnotes.delete()
    res.send("notes deleted")
})

app.put('/edit/:notesid',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    const userid=req.user.id
    const notesid=req.params.notesid
    let foundnotes=null
    try{
        foundnotes=await Notes.findById(notesid)
    }
    catch(err){
        return res.status(400).json({
            "err":err.message
        })
    }
    if (!foundnotes){
        return res.status(404).json({
            "err":"notes not found"
        })
    }

    if (userid!==String(foundnotes.user)){
        return res.send("this post doesn't belong to user")
    }
    const title=req.body.title
    const description=req.body.description
    const tag=req.body.tag

    await Notes.findByIdAndUpdate(notesid,{
        "title":title,
        "description":description,
        "tag":tag,
        "user":req.user.id
    })
    res.send("updates")

})

app.listen(3000, () => {
    console.log("server is running")
})