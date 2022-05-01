const bcrypt = require('bcrypt');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const {SECRET} = require("../Config");
const passport = require('passport');


/**
 * @Desc to register the user (ADMIN,SUPER_ADMIN,USER)
 **/

const userRegister = async (userDets, role, res) => {
    try {
        //Validation for username and email
        let userNameTaken = await validateUserName(userDets.username);
        if (userNameTaken) {
            return res.status(400).json({message: `Username is Taken`, success: false});
        }

        let emailRegistered = await validateUserEmail(userDets.email);
        if (emailRegistered) {
            return res.status(400).json({message: `Email already Taken`, success: false});
        }

        //Hash the password
        const password = await bcrypt.hash(userDets.password, 12);

        //Create new User
        const newUser = User({...userDets, password, role});
        await newUser.save();
        return res.status(201).json({message: `New User Created`, success: true});
    } catch (err) {
        return res.status(201).json({message: `Unable to create user ${err}`, success: false});
    }
}

/**
 * @Desc to Login the user (ADMIN,SUPER_ADMIN,USER)
 **/

const userLogin = async (userCreds, role, res) => {
    let {username, password} = userCreds;
    const user = await User.findOne({username});

    //Check user name
    if (!user) {
        return res.status(404).json({message: "Username not found. Invalid user credentials ", success: false});
    }

    //Check the role
    if (user.role !== role) {
        return res.status(403).json({message: "Make sure you are logging in from right portal", success: false});
    }

    //Check the password
    const isMatch = bcrypt.compare(password, user.password)
    if (!isMatch) {
        return res.status(404).json({message: "Incorrect Password ", success: false});
    } else {
        const token = jwt.sign({
            user_id: user._id,
            role: user.role,
            username: user.username,
            email: user.email
        }, SECRET, {expiresIn: "7 days"});

        let result = {
            username: user.username,
            role: user.role,
            email: user.email,
            token,
            expiresIn: 168
        }
        return res.status(200).json({...result, message: "You are now logged in", success: true});
    }
}

/**
 * @Desc to User Authencation (ADMIN,SUPER_ADMIN,USER)
 **/

const userAuth = passport.authenticate('jwt', {session: false});

/**
 * @Desc to check Role ADMIN,SUPER_ADMIN,USER)
 **/

const checkRole = roles => (req, res, next) => {
    if (roles.includes(req.user.role)) {
        return next()
    }
    return res.status(401).json({message: "Unauthorized", success: false});
}

const validateUserName = async username => {
    let user = await User.findOne({username});
    return !!user;
}

const validateUserEmail = async email => {
    let user = await User.findOne({email});
    return !!user;
}

const serializeUser = user => {
    return {
        username: user.username,
        email: user.email,
        name: user.name,
        _id: user._id,
        updatedAt: user.updatedAt,
        createdAt: user.createdAt
    }
}
module.exports = {userRegister, userLogin, userAuth, serializeUser,checkRole};