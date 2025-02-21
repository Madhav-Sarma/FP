const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// Adding multer middleware for handling file uploads
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.get('/:menteeId', activityController.getActivities);
router.post('/', upload.single('pdf'), activityController.createActivity);

module.exports = router;
