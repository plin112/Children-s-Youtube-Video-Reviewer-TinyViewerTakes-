import { ObjectId } from "mongodb";
import { channels } from "../config/mongoCollections.js";
import * as helpers from '../helpers.js';
  
    const createReview = async (
        channelId,
        title,
        reviewerName,
        review,
        rating
      ) => {
      
        //Validate input.
        helpers.validate([
          { value: channelId, type: 'string', name: 'channelId' },
          { value: title, type: 'string', name: 'title' },
          { value: reviewerName, type: 'string', name: 'reviewerName' },
          { value: review, type: 'string', name: 'review'},
          { value: rating, type: 'number', name: 'rating', range: { min: 1, max: 5 } },
        ]);
      
        //Check if rating has more than one decimal place.
        if (!/^\d(\.\d)?$/.test(String(rating))) {
          throw new Error('The Rating must have at most one decimal place.');
        }
      
        //Check if channelId is a valid ObjectId
        if (!ObjectId.isValid(channelId)) {
          throw new Error('Error: Channel ID provided is not a valid Object ID.');
        }
      
        //Obtain connection to channels collection.
        const channelCollection = await channels();
      
        //Convert string channelId to ObjectId.
        const objChannelId = new ObjectId(channelId);
      
        //Find the channel to which the review will be added.
        const channel = await channelCollection.findOne({ _id: objChannelId });
      
        if (!channel) {
          throw new Error(`Error: No channel found with the id: ${channelId}`);
        }
      
        //Create new review object.
        const newReview = {
          _id: new ObjectId(),
          title: title.trim(),
          reviewerName: reviewerName.trim(),
          review: review.trim(),
          rating,
          reviewDate: new Date().toLocaleDateString('en-US')
        };
      
        //Update the channel with new review and update the average rating.
        const updateInfo = await channelCollection.updateOne(
          { _id: objChannelId },
          {
            $push: { reviews: newReview },
            $set: { averageRating: helpers.calculateNewAverage(channel.reviews, rating) }
          }
        );
      
        //If no channel was found for the id or no modification was made, then throw an error.
        if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
          throw new Error('Error: Failed to add review to the channel.');
        }
      
        return newReview;
      
      };
      
      const getAllReviews = async (channelId) => {
      
        //Validate the input.
        helpers.validate([{ value: channelId, type: 'string', name: 'channelId' }]);
        
        //Check if channelId is a valid ObjectId.
        if (!ObjectId.isValid(channelId)) {
          throw new Error('Error: channel ID provided is not a valid Object ID');
        }
      
        //Obtain a connection to the channels collection.
        const channelCollection = await channels();
      
        //Convert string channelId to OpjectId.
        const objchannelId = new ObjectId(channelId);
      
        //Find the channel and get only the reviews using projectioin
        const channel = await channelCollection.findOne({ _id: objchannelId }, { projection: { reviews: 1, _id: 0 } });
      
        //If no channel was found for the ID, then throw an error.
        if (!channel) {
          throw new Error(`Error: No channel found with the id: ${channelId}`);
        }
      
        //Return the reviews or an empty array if no reviews exist.
        return channel.reviews || [];
      };
      
      const getReview = async (reviewId) => {
      
        //Validate the input.
        helpers.validate([{ value: reviewId, type: 'string', name: 'reviewId' }]);
      
        //If the reviewId is not a valid ObjectId, then throw an error.
        if (!ObjectId.isValid(reviewId)) {
          throw new Error('Error: Review ID provided is not a valid Object ID.');
        }
      
        //Obtain a connection to the channel collection.
        const channelCollection = await channels();
      
        //Convert string channelId to OpjectId.
        const objReviewId = new ObjectId(reviewId);
      
        //Find the review with objReviewId. Use projection to only return the reviews field of the
        //document and only return the first element that matches the filter.
        const channel = await channelCollection.findOne(
          {"reviews._id": objReviewId },
          { projection: { "reviews.$": 1 } }
        );
      
        //If no channel is found that has a review with reviewId or the reviews array of that channel is empty.
        if (!channel || channel.reviews.length === 0) {
          throw new Error(`Error: No review found with the id: ${reviewId}`);
        }
      
        //Return the specific review.
        const review = channel.reviews[0];
        return {
          _id:review._id,
          title: review.title,
          reviewDate: review.reviewDate,
          reviewerName: review.reviewerName,
          review: review.review,
          rating: review.rating
        };
      };
      
      const removeReview = async (reviewId) => {
      
        //Validate the input.
        helpers.validate([{ value: reviewId, type: 'string', name: 'reviewId' }]);
      
        if (!ObjectId.isValid(reviewId)) {
          throw new Error('Error: Review ID provided is not a valid Object ID.');
        }
      
        //Obtain a connection to the channel collection.
        const channelCollection = await channels();
      
        //Convert string id to ObjectId.
        const objReviewId = new ObjectId(reviewId);
      
        //Find the channel containing the review.
        const channel = await channelCollection.findOne({ "reviews._id": objReviewId });
      
        //If no channel was found that contains the review with the provided id, throw an error.
        if (!channel) {
          throw new Error('Error: No channel was found for the specified review.');
        }
      
        //Remove the review from the channel.
        const updateInfo = await channelCollection.updateOne(
          { _id: channel._id },
          { $pull: { reviews: { _id: objReviewId } } }
        );
      
        //If no channels matched the filter or no modification was made, throw an error.
        if (!updateInfo.matchedCount || !updateInfo.modifiedCount) {
          throw new Error('Error: Failed to remove the review.');
        }
      
        //Recalculate the average rating by passing an array of all the reviews besides the one that was just removed to the function.
        const newAverageRating = helpers.calculateNewAverage(channel.reviews.filter(review => review._id.toString() !== reviewId));
      
        //Update the average rating of the channel from which the review was removed.
        await channelCollection.updateOne(
          { _id: channel._id },
          { $set: { averageRating: newAverageRating }}
        );
      
        //Return the updated channel.
        return await channelCollection.findOne( { _id: channel._id});
      
      };
      
      export {
        createReview,
        getAllReviews,
        getReview,
        removeReview
      }
