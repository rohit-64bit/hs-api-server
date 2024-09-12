const User = require("../models/User");
const errorLooger = require("../utils/errorLooger");
const jwt = require('jsonwebtoken');

const validateUser = async (req, res, next) => {

    try {

        const token = req.header('auth-token');

        if (!token) {

            return res.status(401).json({
                success: false,
                message: 'Access Denied',
                level: '1'
            });

        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (!verified) {

            return res.status(401).json({
                success: false,
                message: 'Access Denied',
                level: '2'
            });

        }

        const validateUser = await User.findById(verified.id).select('-password');

        if (!validateUser || validateUser.userType !== verified.userType) {

            return res.status(401).json({
                success: false,
                message: 'Access Denied',
                level: '3'
            });

        }

        req.user = verified;

        req.userProfile = validateUser;

        next();

    } catch (error) {

        errorLooger(error, req, res);

    }

}

module.exports = validateUser;