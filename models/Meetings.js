const { Schema, model } = require('mongoose');

const MeetingSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
    },
    link: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    recordingLink: {
        type: String
    },
    status: {
        type: String,
        default: 'upcoming',
        enum: ['upcoming', 'live', 'completed']
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    createdByType: {
        type: String,
        required: true,
        enum: ['user', 'institute', 'admin']
    },

}, {
    timestamps: true
});

module.exports = model('meeting', MeetingSchema);