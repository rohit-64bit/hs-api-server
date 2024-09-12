const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator')
const jwt = require('jsonwebtoken');
const client = require('../utils/mailer');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    type: {
        type: String,
        default: 'user',
        enum: ['user', 'institute']
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true
});

UserSchema.methods.generatePassword = async function (reqType) {

    const password = otpGenerator.generate(12);

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);

    if (reqType === 'admin') {
        this.isVerified = true;
    }

    console.log(password)

    await this.save();

    // send email to user with temp pass
    await client.sendMail(
        {
            from: process.env.MAIL,
            to: `${this.email}`,
            subject: `Hey ${this.fullName} ${reqType === 'admin' ? 'your account is verified' : 'your password is reset'} successfully.`,
            text: `Your temporary password is ${password}\nPlease login and change your password\n\nThank you`
        }
    ).catch(err => {
        console.error(err)
    });

}

UserSchema.methods.authorizeUser = async function (password) {

    const isMatch = await bcrypt.compare(password, this.password);

    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: this.id, type: this.type }, process.env.JWT_SECRET);

    this.lastLogin = Date.now();

    await this.save();

    return token;

}

UserSchema.methods.updateProfile = async function (data) {

    let tempData = {}

    if (data.fullName) {
        tempData.fullName = data.fullName;
    }

    if (data.contactNo) {
        tempData.contactNo = data.contactNo;
    }

    if (data.password) {

        if (data.oldPassword) {
            const isMatch = await bcrypt.compare(data.oldPassword, this.password);
            if (!isMatch) {
                throw new Error('Invalid old password');
            }
        }

        const salt = await bcrypt.genSalt(10);
        tempData.password = await bcrypt.hash(data.password, salt);
    }

    await this.updateOne(tempData);

}

module.exports = mongoose.model('User', UserSchema);