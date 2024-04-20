import {Router} from 'express';
import { reviewData, channelData, userData } from '../data/index.js';
import validation from '../data/validation.js';
const router = Router();

//need authentication stuff?? 
router
    .route('/')
    .post( async (req, res) => {
    const { userName } = req.body;    

    try {
        //validation.validateString(userName, 'Username');
        const newUser = await userData.create(userName.trim());
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

export default router;
