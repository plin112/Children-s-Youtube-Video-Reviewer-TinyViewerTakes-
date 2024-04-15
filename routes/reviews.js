import {Router} from 'express';
import { reviewData, channelData, userData } from '../data/index.js';
import validation from '../data/validation.js';
const router = Router();

//need authentication stuff?? 
router
// Get all reviews  for a specific channel
    .route('/channels/:channelId/reviews')
    .get(async (req, res) => {

    try {
        const channelId = validation.validateId(
            req.params.channelId, 
            'Channel ID URL Param'
        );
        //await channelData.getChannelById(channelId);
        const reviews = await reviewData.getAllReviews(channelId);
        res.json(reviews);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
  })
  .post(async (req, res) => {
    //new review under a specific channel
    try {
    const channelId = req.params.channelId;
    const { title, reviewerName, review, rating } = req.body; 
    //const userId = req.user.id;
        // just need to validate channelId, userId, reviewContent, and rating 
        // need to add userId to the createReview i think 

        const newReview = await reviewData.createReview(channelId, title, reviewerName, review, rating);
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});
    router
    //remove a review by its Id
    .route('/review/:reviewId')
  .get(async (req, res) => {
    try {
      req.params.reviewId = validation.validateId(req.params.reviewId, 'Review ID URL Param');
  } catch (e) {
      return res.status(400).json({ error: e.toString() });
  }
    try {
      const review = await reviewData.getReview(req.params.reviewId);
      return res.json(review);
  } catch (e) {
      return res.status(404).json({ error: e.toString() });
  }
  })
    .delete(async (req, res) => {
        //const userId = req.user.id;
    try {
        console.log(req.params);
        const revId  = req.params.reviewId;  
        console.log(revId);
        //need to ensure Id's match
        //const review = await reviewData.getReview(reviewId);
        /*if (review.userId !== userId) {
            return res.status(403).json({ error: "You're not authorized to delete this review" });
        }*/

        const updatedChannel = await reviewData.removeReview(revId);
        return res.json(updatedChannel);
    } catch (error) {
        res.status(400).json({ error: error.toString() });
    }
});

export default router;