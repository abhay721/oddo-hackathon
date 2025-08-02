const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const auth = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "YOUR_CLOUD_NAME",
    api_key: process.env.CLOUDINARY_API_KEY || "YOUR_API_KEY",
    api_secret: process.env.CLOUDINARY_API_SECRET || "YOUR_API_SECRET"
});
const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.array('photos', 35), async (req, res) => {
    let photos = [];
    if (req.files && req.files.length > 0) {
        for (let file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, { folder: "civictrack" });
            photos.push(result.secure_url);
            fs.unlinkSync(file.path);
        }
    }
    req.body.photos = photos;
    req.body.reporter = {
        anonymous: req.body.anonymous === "true" || req.body.anonymous === true,
        name: req.body.anonymous === "true" || req.body.anonymous === true ? "" : req.user.name,
        email: req.body.anonymous === "true" || req.body.anonymous === true ? "" : req.user.email,
        userId: req.user.id
    };
    await issueController.createIssue(req, res);
});

router.get('/nearby', issueController.getIssuesNearby);
router.patch('/:id/status', auth, issueController.updateStatus);
router.post('/:id/flag', auth, issueController.flagIssue);

module.exports = router;