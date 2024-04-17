import {Router} from 'express';
const router = Router();
import {userData} from '../data/index.js';
import {reviewData} from '../data/index.js';
import {channelData} from '../data/index.js';

import validation from '../data/validation.js';

// POST route to create a new channel
router
    .post('/', async (req, res) => {
    const { channelTitle, channelOwnerName, channelDescription, channelWebsite, keywords, categories } = req.body;

    try {
        validation.validateString(channelTitle, 'Channel Title');
        validation.validateString(channelOwnerName, 'Channel Owner Name');
        validation.validateString(channelDescription, 'Channel Description');
        //validation.validateString(channelWebsite, 'Channel Website');
        validation.validateStringArray(keywords, 'Keywords');
        validation.validateStringArray(categories, 'Categories');

        const newChannel = await channelData.createChannel(
            channelTitle,
            channelOwnerName,
            channelDescription,
            channelWebsite,
            keywords,
            categories
        );
        res.status(201).json(newChannel);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});
/*
// GET route to list all channels
router.get('/', async (req, res) => {
    try {
        const channelsList = await channelData.getAll();
        res.json(channelsList);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

router.get('/:channelId', async (req, res) => {
    const { channelId } = req.params;

    try {
        validation.checkString(channelId, 'Channel ID');

        const channelDetails = await channelData.getChannelById(channelId); 
        res.json(channelDetails);
    } catch (error) {
        res.status(404).json({ error: error.toString() });
    }
});*/

export default router;