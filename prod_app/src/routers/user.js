const express = require("express");
const User = require("../models/user");

const { authentication, registrationMiddleware } = require('../middleware/authentication');
const {registerView, loginView } = require('../controllers/login');

const router = new express.Router();

// router.get('/', dashboardView);
router.get('/register', registerView);
router.get('/login', loginView);


router.get('/api/users/:id', authentication, async (req, res) => {
    try {
        const _id = req.params.id;
        const user = await User.findById({
            _id
        });
        if(!user)
            return res.status(404).send()
        res.status(200).send(user);
    } catch (e) {
        return res.status(400).send({
            message: e.message
        })
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        res.render('dashboard', {
            users: users
        });
    } catch (e) {
        res.render('dashboard', {
            message: e.message,
        });
    }
});

router.delete('/api/users/:id', authentication, async (req, res, next) => {
    try {
        const _id = req.params.id;
        const user = await User.findByIdAndDelete({
            _id
        });
        if(!user)
            return res.status(404).send()
        res.status(204).send();
    } catch(e) {
        return res.status(400);
    }
});

router.patch('/api/users/:id', authentication, async(req, res) =>{
    const _id = req.params.id;
    const userUpdates = Object.keys(req.body);
    const allowedUpdates = ['username', 'password'];
    const isAllowedToUpdate = userUpdates.every((update) => {
        return allowedUpdates.includes(update);
    });
    if(!isAllowedToUpdate){
        return res.status(400).send({
            error: "Unable to update information"
        });
    }
    try{
        const user = await User.findOne({
            _id
        });
        if(!user)
            return res.status(404).send('User not found');

        userUpdates.forEach(el => {
            user[el] = req.body[el]
        })
        await user.save();
        res.status(204).send();
    } catch(e){
        res.status(400);
    }
});

router.post('/register', registrationMiddleware,async (req, res) => {
    try {
        const user = new User(req.body);
        user.save().then(res.redirect("/login"))
            .catch((err) => console.log(err));
    } catch (e) {
        res.render("/register", {
            message: e.message
        });
    }
});

router.post('/login', async (req,res) =>{
    try{
        const user = await User.FindByCredentials(req.body.username, req.body.password);
        const token = Buffer.from(JSON.stringify({
            username: user.username,
            password: user.password
        })).toString('base64');
        res.redirect(`/?token=${token}&id=${user._id}`)
    } catch(e) {
        res.render("login", {
            message: e.message
        });
    }
});
module.exports = router;