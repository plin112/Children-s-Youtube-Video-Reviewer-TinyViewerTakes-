// This data file should export all functions using the ES6 standard as shown in the lecture code
// Handler

import { channels, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const createComment = async (
    channelId,
    reviewId,
    userId,
    text
) => {
    try {

        if (!ObjectId.isValid(channelId) || !ObjectId.isValid(reviewId)) {
            throw new Error("Invalid channel or review ID");
        }

        const channelCollection = await channels();
        const userCollection = await users();
        //const reviewCollection = await reviews();
        const commentData = {
            _id: new ObjectId(), // Generate new ObjectId for the comment
            userId: userId,
            text,
            createdDate: new Date() // Store the date when the comment was created
        };

        const objUserId = new ObjectId(userId);
        const user = await userCollection.findOne({ _id: objUserId });

        if (!user) {
            throw new Error(`No user found with id: ${userId}`);
        }

        // Embed the comment directly into the review's comments array
        // const updateResult = await reviewCollection.updateOne(
        //     { _id: new ObjectId(reviewId) },
        //     { $push: { comments: commentData } }
        // );
        const updateResult = await channelCollection.updateOne(
            { "_id": new ObjectId(channelId), 
            "reviews._id": new ObjectId(reviewId) },
            { $push: { "reviews.$.comments": commentData } }
        );

        if (updateResult.modifiedCount === 0) {
            throw new Error("Channel or review not found or comment not added");
        }

        //Find the user to which the review will be added.
        const userToUpdate = await userCollection.findOne({ _id: objUserId });

        if (!userToUpdate) {
            throw new Error(`Error: No user found with the id: ${userId}`);
        }

        //Update the user with new review
        // const updateUser = await userCollection.findOneAndUpdate(
        //     { _id: new ObjectId(reviewerId) },
        //     { $push: { "reviewComments": commentData } },
        //     { returnDocument: "after" }
        // );

        return commentData; // Return the newly created comment
    } catch (error) {
        throw new Error(`Failed to create comment: ${error.message}`);
    }
};


//         //Not my code below

//         const dataToAdd = {
//             reviewId,
//             userId,
//             text
//         }
      
//         const commentCollection = await comments();
//         const reviewCollection = await reviews();

//         // console.log("adddedcheck:", productCollection)
//         const updatedInfo = await commentCollection.insertOne(dataToAdd)
//         return updatedInfo;
//         //console.log("updateinfo", updatedInfo)
//     } catch (e) {
//         return null
//     }

// };

export const getAllComments = async (reviewId) => { 
    try {
        
        if (!ObjectId.isValid(reviewId)) {
            throw new Error('Invalid review ID');
        }

        const channelCollection = await channels();
        const channel = await channelCollection.findOne(
            {"reviews._id": new ObjectId(reviewId)}, 
            {projection: {"reviews.$": 1}}
        );

        // if (!review) {
        //     throw new Error('Review not found');
        // }
        if (!channel || !channel.reviews || channel.reviews.length === 0) {
            throw new Error('Review not found');
        }


        return channel.reviews[0].comments || [];

        //return review.comments || []; // Return comments array or empty array if no comments
    } catch (error) {
        throw new Error(`Failed to retrieve comments: ${error.message}`);
    }
};
        
        
        
//         console.log("kk",reviewId);
//         if (!ObjectId.isValid(reviewId)) {
//             throw new Error('Error: channel ID provided is not a valid Object ID');
//           }
//           const objreviewId = new ObjectId(reviewId);

//         const commentCollection = await comments();
//         const reviewCollection = await reviews();
//         const review= await reviewCollection.findOne({ _id: objreviewId })
//         console.log("k2",review);

//         const commentIds = review.comments;
// const objCommentIds = commentIds.map(id => new ObjectId(id));
// const allComments = await commentCollection.find({ _id: { $in: objCommentIds } }).toArray()
//         .then((res) => {
//             // console.log(res);
//             return res
//         })

//         return allComments
//     } catch (e) {
//         return null
//     }
// };

export const getComment = async (commentId) => { 
    try {

        if (!ObjectId.isValid(commentId)) {
            throw new Error("Invalid comment ID");
        }

        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne(
            { "comments._id": new ObjectId(commentId) },
            { projection: { "comments.$": 1 } }  // Use projection to get the specific comment
        );

        if (!review || !review.comments) {
            throw new Error("Comment not found");
        }

        return review.comments[0]; // Return the specific comment
    } catch (error) {
        throw new Error(`Failed to retrieve comment: ${error.message}`);
    }
};


//         if (!ObjectId.isValid(commentId)) throw "invalid object ID";
//         const commentCollection = await comments();
//         const comment = await commentCollection.findOne(
//             { _id: new ObjectId(commentId) } )

//         const reviewById = review[0].reviews.find((fData) => new ObjectId(fData._id).toString() === reviewId)
//         //console.log("reviews:", reviewById)
//         if (!comment) {
//             return null
//         } else {
//             return comment
//         }
//     } catch {
//         return null
//     }
// };

// export const updateComment = async (commentId, updateObject) => {
//     try {
//         //error handling
//         //const reviewId = reviewId;
//         const commentCollection = await comments();
//         const comment = await commentCollection.findOne( // whole document
//               { _id: new ObjectId(commentId) } 
//         )
//             // console.log("review whole doc:",review)
//             if (comment) {
//                 // Update the comment document with the properties in updateObject
//                 const updatedComment = { ...comment, ...updateObject };
                
//                 // Update the comment document in the collection
//                 await commentCollection.updateOne({ _id: comment._id }, { $set: updatedComment });
                
//                 return { success: true, message: "Comment updated successfully" };
//             } else {
//                 return { success: false, message: "Comment not found" };
//             }

//     } catch (e) {
//         return null
//     }

// };

// export const removeComment= async (commentId) => {
//     try {
//         //error handling
//         if (!ObjectId.isValid(commentId)) throw 'invalid object ID';
//         //const reviewId = reviewId;
//         const commentCollection = await comments();
//         const comment = await commentCollection.findOne( // whole document
//               { _id: new ObjectId(commentId) } 
//         )
//             // console.log("review whole doc:",review)
//             if (comment) {
                
//                 await commentCollection.deleteOne({ _id: comment._id });
                
//                 return { success: true, message: "Comment deleted successfully" };
//             } else {
//                 return { success: false, message: "Comment not found" };
//             }
        

//     } catch (e) {
//         return null
//     }
// };
