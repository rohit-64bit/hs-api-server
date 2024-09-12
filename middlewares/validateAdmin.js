const Admin = require("../models/Admin");
const errorLooger = require("../utils/errorLooger");
const jwt = require('jsonwebtoken');

const validateAdmin = async (req, res, next) => {

    try {

        const token = req.header('admin-auth-token');

        if (!token) {

            return res.status(401).json({
                success: false,
                message: 'Access Denied',
                level: '1',
                type: 'auth-err'
            });

        }

        const validated = jwt.verify(token, process.env.JWT_SECRET);

        if (!validated) {

            return res.status(401).json({
                success: false,
                message: 'Access Denied',
                level: '2',
                type: 'auth-err'
            });

        }

        const getAdmin = await Admin.findById(validated.id).select('-password');

        if (!getAdmin) {

            return res.status(401).json({
                success: false,
                message: 'Access Denied',
                level: '3',
                type: 'auth-err'
            });

        }

        req.admin = validated;

        req.adminProfile = getAdmin;

        next();

    } catch (error) {

        errorLooger(error, req, res);

    }

}

module.exports = validateAdmin;