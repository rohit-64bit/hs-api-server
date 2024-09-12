const { Router } = require('express');
const router = Router();

const errorLooger = require('../utils/errorLooger');
const Meetings = require('../models/Meetings');
const validateUser = require('../middlewares/validateUser');
const validateAdmin = require('../middlewares/validateAdmin');

const meetingCodeGenerate = require('../utils/meetingCodeGenerate');

router.post('/user-create', validateUser, async (req, res) => {

    try {

        const { title, description, date, participants } = req.body;

        const code = await meetingCodeGenerate();

        const data = new Meetings({
            title,
            description,
            date,
            link: code,
            participants,
            createdBy: req.user.id,
            createdByType: 'user'
        });

        await data.save();

        res.status(200).json({
            success: true,
            message: 'Meeting created successfully'
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/admin-create', validateAdmin, async (req, res) => {

    try {

        const { title, description, date, participants } = req.body;

        const code = await meetingCodeGenerate();

        const data = new Meetings({
            title,
            description,
            date,
            link: code,
            participants,
            createdBy: req.admin.id,
            createdByType: 'admin'
        });

        await data.save();

        res.status(200).json({
            success: true,
            message: 'Meeting created successfully'
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.get('/user-get', validateUser, async (req, res) => {

    try {

        const data = await Meetings.find({ createdBy: req.user.id, createdByType: 'user' });

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.get('/admin-get', validateAdmin, async (req, res) => {

    try {

        const data = await Meetings.find({ createdBy: req.admin.id, createdByType: 'admin' });

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/verify-room-id', validateUser, async (req, res) => {

    try {

        const { roomId } = req.query;

        const data = await Meetings.findOne({ link: roomId });

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Invalid room id'
            });
        }

        res.status(200).json({
            success: true,
            data
        });

    } catch (error) {

        errorLooger(error, req, res);

    }

})

router.post('/mark-meeting-done', validateUser, async (req, res) => {

    try {

        const { roomId } = req.query;

        const data = await Meetings.findOne({ link: roomId });

        if (!data) {
            return res.status(400).json({
                success: false,
                message: 'Invalid room id'
            });
        }

        data.status = 'completed';

        await data.save();

        res.status(200).json({
            success: true,
            message: 'Meeting Ended'
        })

    } catch (error) {

        errorLooger(error, req, res);

    }

})


module.exports = router;