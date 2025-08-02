const Issue = require('../models/Issue');

exports.createIssue = async (req, res) => {
    try {
        const issue = new Issue(req.body);
        issue.statusLogs.push({status: issue.status, timestamp: new Date(), note: "Issue reported"});
        await issue.save();
        res.status(201).json(issue);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
};

exports.getIssuesNearby = async (req, res) => {
    const { lat, lng, radius } = req.query;
    // Demo: just return all issues. For production, use geospatial filtering.
    const issues = await Issue.find();
    res.json(issues);
};

exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status, note } = req.body;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({error: 'Issue not found'});
    issue.status = status;
    issue.statusLogs.push({status, timestamp: new Date(), note});
    await issue.save();
    res.json(issue);
};

exports.flagIssue = async (req, res) => {
    const { id } = req.params;
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({error: 'Issue not found'});
    issue.flags += 1;
    if (issue.flags >= 3) issue.flagged = true;
    await issue.save();
    res.json(issue);
};