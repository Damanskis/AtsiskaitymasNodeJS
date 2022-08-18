const User = require('../models/user');
const { checkUppercase } = require('../utils/utils');

const authentication = async (req, res, next) => {
    try {
        const userToken = req.header('Authorization').replace('Bearer', '').trim();
        const data = JSON.parse(Buffer.from(userToken, 'base64').toString('ascii'));
        const user = await User.findOne({
            username: data.username,
            password: data.password,
        });
        if(!user){
            throw new Error('ERROR! User not found!');
        }
        req.user = user;
        next();
    } catch (e) {
        return res.status(401).send({
            error: "ERROR! User not authenticated."
        });

    }
};

const registrationMiddleware = async (req, res, next) => {
    try {
        const userData = new User(req.body);
        if (userData.username == "") {
            res.render("register", {
                message: 'ERROR! "Username is required field!"'
            });
        }
        if (userData.username.length < 5) {
            res.render("register", {
                message: 'ERROR! "Username must contain 5 or more letters"'
            });
        }
        if (!checkUppercase(userData.username)) {
            res.render("register", {
                message: 'ERROR! "Username must contain one uppercase letter"'
            });
        }
        if (userData.password == "") {
            res.render("register", {
                message: 'ERROR! "Password is required field!"'
            });
        }
        if (userData.password .length < 5) {
            res.render("register", {
                message: 'ERROR! "Password must contain 5 or more letters"'
            });
        }
        next();
    } catch (e) {
        return res.status(401).send({
            message: "Bad data is given!"
        });

    }
};

module.exports = { authentication, registrationMiddleware }