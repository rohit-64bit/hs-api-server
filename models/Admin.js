const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AdminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});


AdminSchema.methods.resetPassword = async function (newPassword) {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    this.password = hashedPassword;
    await this.save();

}

AdminSchema.methods.authorizeAdmin = async function (password) {

    const isMatch = await bcrypt.compare(password, this.password);

    if (!isMatch) {
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign({ id: this.id, userType: 'admin' }, process.env.JWT_SECRET);

    return token;

}

module.exports = mongoose.model('admin', AdminSchema);