const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');

const Admin = require('../models/Admin');

const errorLooger = require('../utils/errorLooger');

router.post('/generate', async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            });

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = new Admin({
            email,
            password: hashedPassword
        });

        await admin.save();

        res.status(201).json({
            success: true,
            message: 'Admin created successfully'
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        console.log(req.body)

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            });

        }

        const validateAdmin = await Admin.findOne({ email })

        if (!validateAdmin) {

            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });

        }

        const token = await validateAdmin.authorizeAdmin(password);

        if (!token) {

            return res.status(400).json({
                success: false,
                message: token
            });

        }

        res.status(200).json({
            success: true,
            message: 'Login success',
            token
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

module.exports = router;