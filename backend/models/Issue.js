const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
    title: String,
    description: String,
    photos: [String],
    category: String,
    location: {
        lat: Number,
        lng: Number,
        address: String,
    },
    reporter: {
        anonymous: Boolean,
        name: String,
        email: String,
        userId: String
    },
    status: {
        type: String,
        enum: ['Reported', 'In Progress', 'Resolved'],
        default: 'Reported'
    },
    statusLogs: [{
        status: String,
        timestamp: Date,
        note: String
    }],
    flagged: { type: Boolean, default: false },
    flags: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', IssueSchema);