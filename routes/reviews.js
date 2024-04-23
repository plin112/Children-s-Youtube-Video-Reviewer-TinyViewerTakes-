import { Router } from "express";
import {
  reviewData,
  channelData,
  userData,
  commentData,
} from "../data/index.js";
import validation from "../data/validation.js";
const router = Router();

//need authentication stuff??
router
  // Get all reviews  for a specific channel
  .route("/channels/:channelId/reviews")
  .get(async (req, res) => {
    try {
      const channelId = validation.validateId(
        req.params.channelId,
        "Channel ID URL Param"
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
      //console.log("Session Data:", req.session);

      if (!req.session || !req.session.user) {
        return res.status(401).json({ error: "User not logged in" });
      }

      //console.log(req.session.user);

      const userId = req.session.user._id;
      if (!userId) {
        return res.status(400).json({ error: "User ID is undefined" });
      }
    
      const { channelId } = req.params;
      if (!channelId) {
        return res.status(400).json({ error: "Channel ID is undefined" });
      }
      
      // const userId = req.session.users._id;
      // const channelId = req.params.channelId;
      const { reviewTitle, reviewDescription, reviewRating, reviewerName } = req.body;
      //const userId = req.user.id;
      // just need to validate channelId, userId, reviewContent, and rating
      // need to add userId to the createReview i think

      const newReview = await reviewData.createReview(
        channelId,
        userId,
        reviewTitle,
        reviewDescription,
        parseFloat(reviewRating)
      );

      const channel = await channelData.getChannel(channelId);
      if (newReview) {
        res.render('individualchannel', {channel: channel});
      } else {
        res.status(500).send("Failed to create review");
      }

    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

router
  // Get a review by its id.
  .route("/review/:reviewId")
  .get(async (req, res) => {
    try {
      req.params.reviewId = validation.validateId(
        req.params.reviewId,
        "Review ID URL Param"
      );
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

  //remove a review by its Id
  .delete(async (req, res) => {
    //const userId = req.user.id;
    try {
      console.log(req.params);
      const revId = req.params.reviewId;
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

// get  a comment
router
  //remove a review by its Id
  .route("/comment")
  .post(async (req, res) => {
    try {
      const { reviewId, userId, text } = req.body;
      const newComment = await commentData.createComment(
        reviewId,
        userId,
        text
      );
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ error: error.toString() });
    }
  });

  // Route for adding a comment to a review
router.post('/channels/:channelId/reviews/:reviewId/comments', async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const reviewId = req.params.reviewId;
    const userId = req.session.user._id; // Ensure your session handling is configured correctly
    const commentText = req.body.comment;
    
    // Fetch user details to get the commenter's name
    const user = await userData.getUserById(userId);
    const commenterName = `${user.firstName} ${user.lastName}`;

    // Create the comment
    await commentData.createComment(channelId, reviewId, commenterName, commentText);
    res.redirect(`/channels/${channelId}`); // Make sure this redirects to an appropriate page
  } catch (error) {
    res.status(500).send("Failed to add comment: " + error.message);
  }
});
export default router;
