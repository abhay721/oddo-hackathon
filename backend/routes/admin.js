const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Issue = require('../models/Issue');

router.get('/analytics', auth, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    const totalIssues = await Issue.countDocuments();
    const mostReported = await Issue.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    res.json({ totalIssues, mostReported });
});

router.post('/ban/:userId', auth, async (req, res) => {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
    await User.findByIdAndUpdate(req.params.userId, { banned: true });
    res.json({ message: "User banned" });
});

module.exports = router;