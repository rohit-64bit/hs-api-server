const { Router, text } = require('express');

const router = Router();

const User = require('../models/User');
const errorLooger = require('../utils/errorLooger');
const validateUser = require('../middlewares/validateUser');
const validateAdmin = require('../middlewares/validateAdmin');
const client = require('../utils/mailer');

router.post('/register', async (req, res) => {

    try {

        const {
            fullName,
            email,
            contactNo,
            type,
        } = req.body;

        if (!fullName || !email || !contactNo || !type) {

            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            });

        }

        const user = User({
            fullName,
            email,
            contactNo,
            type,
        });

        await user.save();

        // send email to user with temp pass
        await client.sendMail(
            {
                from: process.env.MAIL,
                to: `${email}`,
                subject: `Hey ${fullName} you are registered successfully.`,
                text: `You will be soon verified by admin.\nA login password will be sent to you soon.\n\nThank you`
            }
        ).catch(err => {
            console.error(err)
        });

        res.status(201).json({
            success: true,
            message: 'Registered Successfully'
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/login', async (req, res) => {

    try {

        const { email, password, type } = req.body;

        if (!email || !password || !type) {

            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            });

        }

        const validateUser = await User.findOne({
            email
        });

        if (!validateUser) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = await validateUser.authorizeUser(password);

        if (!token) {

            return res.status(400).json({
                success: false,
                message: token
            });

        }

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/forget-password', async (req, res) => {

    try {

        // reset the password for the user and send the temp pass to email

        const { email, type } = req.body;

        if (!email || !type) {

            return res.status(400).json({
                success: false,
                message: 'Please enter all fields'
            });

        }

        const validateUser = await User.findOne({
            email, type
        });

        if (!validateUser) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            });
        }

        await validateUser.generatePassword('temp');

        res.status(200).json({
            success: true,
            message: 'Temporary password sent to your email'
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/update-profile', validateUser, async (req, res) => {

    try {

        const data = req.body;

        const status = await req.userProfile.updateProfile(data);

        if (!status) {

            return res.status(400).json({
                success: false,
                message: 'Profile update failed'
            });

        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/verify-user', validateAdmin, async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({
            email
        });

        if (!user) {

            return res.status(400).json({
                success: false,
                message: 'User not found'
            });

        }

        await user.generatePassword('admin');

        res.status(200).json({
            success: true,
            message: 'User verified successfully'
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

module.exports = router;