const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');

router.post('/', issueController.createIssue);
router.get('/nearby', issueController.getIssuesNearby);
router.patch('/:id/status', issueController.updateStatus);
router.post('/:id/flag', issueController.flagIssue);

module.exports = router;