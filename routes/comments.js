import { Router } from 'express';
import { reviewData, channelData, userData, commentData } from '../data/index.js';
import validation from '../data/validation.js';
 const router = Router();


router
    .route('/')
    .post(async (req, res) => {

        try {
            const { reviewId, userId,text } = req.body;

            const newComment = await commentData.createComment(reviewId, userId,text);
            res.status(201).json(newComment);
        } catch (error) {
            res.status(400).json({ error: error.toString() });
        }
    })
    router
    .route('/:reviewId')
    .get(async (req, res) => {
        try {
            const reviewId = req.params.reviewId;

            const getAllComments = await commentData.getAllComments(reviewId)
            res.status(201).json(getAllComments);
        } catch (error) {
            res.status(400).json({ error: error.toString() });
        }
    })
    router
    .route('/:commentId')
    .get(async (req, res) => {
        try {
            const commentId = req.params.commentId;
            const getComment = await commentData.getComment(commentId);
            res.status(201).json(getComment);
        } catch (error) {
            res.status(400).json({ error: error.toString() });
        }
    }) .put(async (req, res) => {
        try { const commentId = req.params.commentId;
            const updatedData= req.body;
            const updateComment = await commentData.updateComment(commentId,updatedData);
            res.status(201).json(updateComment);
        } catch (error) {
            res.status(400).json({ error: error.toString() });
        }
    }) .delete(async (req, res) => {
        try { const commentId = req.params.commentId;
            const updateComment = await commentData.removeComment(commentId);
            res.status(201).json(updateComment);
        } catch (error) {
            res.status(400).json({ error: error.toString() });
        }
    })


    export default router;