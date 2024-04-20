// This data file should export all functions using the ES6 standard as shown in the lecture code
// Handler

import { comments,reviews } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const createComment = async (
    
    reviewId,
    userId,
    text
) => {
    try {
        const dataToAdd = {
            reviewId,
            userId,
            text
        }
      
        const commentCollection = await comments();
        const reviewCollection = await reviews();

        // console.log("adddedcheck:", productCollection)
        const updatedInfo = await commentCollection.insertOne(dataToAdd)
        return updatedInfo;
        //console.log("updateinfo", updatedInfo)
    } catch (e) {
        return null
    }

};

export const getAllComments = async (reviewId) => { 
    try {
        console.log("kk",reviewId);
        if (!ObjectId.isValid(reviewId)) {
            throw new Error('Error: channel ID provided is not a valid Object ID');
          }
          const objreviewId = new ObjectId(reviewId);

        const commentCollection = await comments();
        const reviewCollection = await reviews();
        const review= await reviewCollection.findOne({ _id: objreviewId })
        console.log("k2",review);

        const commentIds = review.comments;
const objCommentIds = commentIds.map(id => new ObjectId(id));
const allComments = await commentCollection.find({ _id: { $in: objCommentIds } }).toArray()
        .then((res) => {
            // console.log(res);
            return res
        })

        return allComments
    } catch (e) {
        return null
    }
};

export const getComment = async (commentId) => { 
    try {
        if (!ObjectId.isValid(commentId)) throw "invalid object ID";
        const commentCollection = await comments();
        const comment = await commentCollection.findOne(
            { _id: new ObjectId(commentId) } )

        const reviewById = review[0].reviews.find((fData) => new ObjectId(fData._id).toString() === reviewId)
        //console.log("reviews:", reviewById)
        if (!comment) {
            return null
        } else {
            return comment
        }
    } catch {
        return null
    }
};

export const updateComment = async (commentId, updateObject) => {
    try {
        //error handling
        //const reviewId = reviewId;
        const commentCollection = await comments();
        const comment = await commentCollection.findOne( // whole document
              { _id: new ObjectId(commentId) } 
        )
            // console.log("review whole doc:",review)
            if (comment) {
                // Update the comment document with the properties in updateObject
                const updatedComment = { ...comment, ...updateObject };
                
                // Update the comment document in the collection
                await commentCollection.updateOne({ _id: comment._id }, { $set: updatedComment });
                
                return { success: true, message: "Comment updated successfully" };
            } else {
                return { success: false, message: "Comment not found" };
            }

    } catch (e) {
        return null
    }

};

export const removeComment= async (commentId) => {
    try {
        //error handling
        if (!ObjectId.isValid(commentId)) throw 'invalid object ID';
        //const reviewId = reviewId;
        const commentCollection = await comments();
        const comment = await commentCollection.findOne( // whole document
              { _id: new ObjectId(commentId) } 
        )
            // console.log("review whole doc:",review)
            if (comment) {
                
                await commentCollection.deleteOne({ _id: comment._id });
                
                return { success: true, message: "Comment deleted successfully" };
            } else {
                return { success: false, message: "Comment not found" };
            }
        

    } catch (e) {
        return null
    }
};
