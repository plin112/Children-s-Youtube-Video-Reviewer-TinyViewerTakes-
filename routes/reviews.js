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
    // const userId = req.session.user._id;
    // const { channelId } = req.params;

    try {
      //console.log("Session Data:", req.session);

      if (!req.session || !req.session.user) {
        return res.status(401).render("login");
      }

      //console.log(req.session.user);

      const userId = req.session.user._id;
      if (!userId) {
        return res.status(400).send("User ID is undefined");
      }

      const { channelId } = req.params;
      if (!channelId) {
        return res.status(400).send("Channel ID is undefined");
      }

      // const userId = req.session.users._id;
      // const channelId = req.params.channelId;
      const { reviewTitle, reviewDescription, reviewRating, reviewerName } =
        req.body;
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
      // if (newReview) {
      //   res.redirect(`/channels/${channelId}`);
      //   //res.render("individualchannel", { channel: channel });
      // } else {
      //   res.status(500).send("Failed to create review");
      // }
      if (!newReview) {
        throw new Error("Failed to create review");
      }

      res.redirect(`/channels/${channelId}`);
    } catch (error) {
      // console.error("Error adding review:", error);
      res.render("error", {
      errorMessage: error, title: "Error"
      });
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
    if (!req.session || !req.session.user) {
      //return res.status(401).send("You are not log in.");
      return res.status(401).render("login");
    }
    try {
      const userId = req.session.user._id;
      const revId = req.params.reviewId;
      //need to ensure Id's match
      //const review = await reviewData.getReview(reviewId);
      /*if (review.userId !== userId) {
                return res.status(403).json({ error: "You're not authorized to delete this review" });
            }*/

      const updatedChannel = await reviewData.removeReview(revId, userId);
      return res.json(updatedChannel);
    } catch (error) {
      console.error("Error removing review:", error);
      res.status(400).send(error);
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
router.post(
  "/channels/:channelId/reviews/:reviewId/comments",
  async (req, res) => {
    if (!req.session || !req.session.user) {
      return res.redirect("/login");
    }
    try {
      const channelId = req.params.channelId;
      const reviewId = req.params.reviewId;
      const userId = req.session.user._id; // Ensure your session handling is configured correctly
      const commentText = req.body.comment;

      // Fetch user details to get the commenter's name
      const user = await userData.getUserById(userId);
      const commenterName = `${user.firstName} ${user.lastName}`;

      // Create the comment
      await commentData.createComment(channelId, reviewId, userId, commentText);
      res.redirect(`/channels/${channelId}`); // Make sure this redirects to an appropriate page
    } catch (error) {
      res.status(500).send("Failed to add comment: " + error.message);
    }
  }
);
export default router;
