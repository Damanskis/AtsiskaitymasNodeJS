const express = require('express');
const multer = require('multer');
const Item = require('../models/items');
const sharp = require('sharp');
const {authentication} = require('../middleware/authentication');
const User = require("../models/user");

const router = new express.Router();

const upload = multer({
    limits:{
        fileSize:10000000000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a image file (jpg/jpeg/png)'));
        }
        cb(undefined, true);
    }
});

router.post('/api/items', authentication, upload.single('image'), async (req,res)=>{
    if(req.file) {
        const buffer = await sharp(req.file.buffer).resize({
            width:250,
            height:250
        }).png().toBuffer();
        const item = new Item({
            image: Buffer.from(buffer, "base64").toString("base64"),
            usersId: req.user._id,
            status: "not_requested"
        })
        const itemPost = await item.save();
        res.status(201).send(itemPost);
    } else {
        res.status(400).send({message: "Please provide image file!"});
    }

}, (error, req, res, next) =>{
    res.status(400).send({message: error.message});
});

router.delete('/api/items/:id', authentication, async (req, res, next) => {
    try {
        const _id = req.params.id;
        const item = await Item.findByIdAndDelete({
            _id
        });
        if(!item)
            return res.status(404).send()
        res.status(204).send();
    } catch(e) {
        return res.status(400);
    }
});

router.patch('/api/items/:id', authentication, async(req, res) =>{
    const _id = req.params.id;
    const itemUpdates = Object.keys(req.body);
    const allowedUpdates = ['userId', 'status', 'requestUserId'];
    const isAllowedToUpdate = itemUpdates.every((update) => {
        return allowedUpdates.includes(update);
    });
    if(!isAllowedToUpdate){
        return res.status(400).send({
            error: "Unable to update information"
        });
    }
    try{
        const item = await Item.findOne({
            _id
        });
        if(!item)
            return res.status(404).send('Item not found');

        itemUpdates.forEach(el => {
            item[el] = req.body[el]
        })
        await item.save();
        res.status(204).send();
    } catch(e){
        res.status(400);
    }
});

router.get('/users/:userid', async (req, res) => {
    const userID = req.params.userid;
    try{
        const items = await Item.find({
            usersId: userID
        });
        if(!items)
            res.redirect("/", {
                message: "No items found"
            });

        const userData = await User.find({
            _id: userID
        });
        res.render('users', {
            items: items,
            user: userData
        });
    } catch(e) {
        res.redirect("/", {
            message: e.message
        });
    }
});

router.get('/users/:userid/requests', async (req, res) => {
    const userID = req.params.userid;
    try{
        const items = await Item.find({
            usersId: userID
        });
        if(!items)
            res.redirect("/", {
                message: "No items found"
            });
        res.render('requests', {
                items: items,
            });   
        
    } catch(e) {
        res.status(500).send(e);
    }
});

router.patch('/api/users/:userid/items/:id', authentication, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['usersId', 'requestStatus', 'requestUserId'];
    const isAllowed = updates.every((element)=>{
        return allowedUpdates.includes(element);
    });
    if(!isAllowed)
        return res.status(400).send({ error: "Invalid update" });
    const _id = req.params.id;
    const usersId = req.params.userid;
    try{
        const item = await Item.findOne({_id});
        if(!item)
            return res.status(404).send();

        updates.forEach(element => {
            if(element === "usersId") {
                item["usersId"] = req.user._id;
            } else {
                item[element] = req.body[element];
            }

        });
        await item.save();
        res.status(204).send(item);
    } catch {
        res.status(400).send;
    }
})

module.exports = router;