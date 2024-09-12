const { Schema, model } = require('mongoose');

const MessageSchema = new Schema({

    message: {
        type: String,
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    inMeeting: {
        type: Schema.Types.ObjectId,
        ref: 'meeting',
        required: true
    },
    byAdmin: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'text',
        enum: ['text', 'file']
    },
    fileLink: {
        type: String
    },
    fileName: {
        type: String
    },
    fileSize: {
        type: Number
    },
    fileType: {
        type: String
    }

})

module.exports = model('message', MessageSchema);