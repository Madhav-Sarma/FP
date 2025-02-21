const NonAcademicActivity = require('../models/Activity');

exports.getActivities = async (req, res) => {
    try {
        const { menteeId } = req.params;
        const activities = await NonAcademicActivity.find({ menteeId });
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createActivity = async (req, res) => {
    try {
        const { menteeId, name, type, description } = req.body;
        const pdfPath = req.file ? req.file.path : null;

        if (!menteeId || !name || !type || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newActivity = new NonAcademicActivity({
            menteeId,
            name,
            type,
            description,
            pdfPath,
        });

        const savedActivity = await newActivity.save();
        res.status(201).json(savedActivity);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
};
