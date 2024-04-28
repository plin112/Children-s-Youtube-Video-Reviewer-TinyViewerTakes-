import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createChannel } from "../data/channels.js";
import { createReview } from "../data/reviews.js";
import { userData } from "../data/index.js";
import {createComment, getAllComments, getComment} from '../data/comment.js'

// const main = async () => {
//   const dababaseSeed = await dbConnection();
//   await dababaseSeed.dropDatabase();

//   let user1;

//   try {
//     user1 = await exportedMethods.registerUser('John', 'Doe', 'john.doe@example.com', 'Password123!');
//     console.log("User 1 added successfully");
//   } catch (error) {
//     console.error("Error creating user 1: ", error);
//   }
//   let review1;

//   try {
//     const pawPatrolChannel = await createChannel(
//       "Paw Patrol",
//       "Paw Patrol Official",
//       "Official channel for Paw Patrol. We have all the episodes available. ",
//       "http://youtube.com/pawpatrol",
//       ["animal", "toy"],
//       ["animation for kids", "cute"],
//       2
//     );
//     console.log("Channel 1 added successfully");

//     review1 = await createReview(
//       pawPatrolChannel._id.toString(),
//       user1._id.toString(),
//       "Great Show",
//       "My kids love watching this show every afternoon!",
//       5
//     );
//     console.log("Review 1 added successfully to Paw Patrol channel");

//     // Add a comment to the review
//     const comment1 = await createComment(
//       pawPatrolChannel._id.toString(),
//       review1._id.toString(),
//       user1._id.toString(),
//       "Absolutely love it!"
//     );
//     console.log("Comment 1 added successfully to Review 1");

//   } catch (error) {
//     console.error("Error creating channel or review: ", error);
//   }

//   try {
//     const peppaPigChannel = await createChannel(
//       "Peppa Pig",
//       "Peppa Pig Official",
//       "Official channel for Peppa Pig.",
//       "http://youtube.com/peppapig",
//       ["kids"],
//       ["kids"],
//       1
//     );
//     console.log("Channel 2 added successfully");
//   } catch (error) {
//     console.error("Error creating channel 2: ", error);
//   }

//   try {
//     const animalKingdomChannel = await createChannel(
//       "Animal Kingdom",
//       "Animal Kingdom Official",
//       "Official channel for Animal Kingdom.",
//       "http://youtube.com/animalkingdom",
//       ["animal"],
//       ["kids"],
//       2
//     );
//     console.log("Channel 3 added successfully");
//   } catch (error) {
//     console.error("Error creating channel 3: ", error);
//   }

//   try {
//     const babySharkChannel = await createChannel(
//       "Baby Shark",
//       "Baby Shark Official",
//       "Official channel for Baby Shark.",
//       "http://youtube.com/babyshark",
//       ["kids", "shark family"],
//       ["kids", "animal"],
//       1
//     );
//     console.log("Channel 4 added successfully");
//   } catch (error) {
//     console.error("Error creating channel 4: ", error);
//   }


//   console.log("Done seeding database");
//   await closeConnection();
// };

// main();

// import { dbConnection, closeConnection } from "../config/mongoConnection.js";
// import { createChannel } from "../data/channels.js";
// import { createReview } from "../data/reviews.js";
// import userData from '../data/users.js';
// import { createComment } from '../data/comments.js';

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    // Creating users
    const user1 = await userData.registerUser('Sera', 'Montgomery', 'sera.montgomery@example.com', 'Password123!', 'Password123!');
    const user2 = await userData.registerUser('Khalid', 'Thompson', 'khalid.thompson@example.com', 'Password123!', 'Password123!');
    const user3 = await userData.registerUser('Priscilla', 'Wright', 'priscilla.wright@example.com', 'Password123!', 'Password123!');

    // Creating channels
    const channel1 = await createChannel("Channel One", "Channel One Inc", "Description for Channel One", "http://www.channelone.com", ["educational", "fun"], ["children", "learning"], 3);
    const channel2 = await createChannel("Channel Two", "Channel Two Inc", "Description for Channel Two", "http://www.channeltwo.com", ["action", "adventure"], ["teens", "action"], 13);
    const channel3 = await createChannel("Channel Three", "Channel Three Inc", "Description for Channel Three", "http://www.channelthree.com", ["comedy"], ["adults", "comedy"], 18);
    const channel4 = await createChannel("Channel Four", "Channel Four Inc", "Description for Channel Four", "http://www.channelfour.com", ["horror", "thriller"], ["adults", "horror"], 18);

    // Creating reviews and comments
    for (let i = 1; i <= 4; i++) {
        const channel = eval('channel' + i);
        const reviewUser1 = await createReview(channel._id.toString(), user1._id.toString(), "Great content!", "Loved the videos, very engaging and informative.", 5);
        const comment1 = await createComment(channel._id.toString(), reviewUser1._id.toString(), user2._id.toString(), "Totally agree with this review!");

        const reviewUser2 = await createReview(channel._id.toString(), user2._id.toString(), "Not bad", "Decent content but could be improved in some areas.", 4);
        const comment2 = await createComment(channel._id.toString(), reviewUser2._id.toString(), user3._id.toString(), "I think it's perfect the way it is!");

        console.log(`Reviews and comments added for Channel ${i}`);
    }

    console.log("Database seeded successfully.");
    await closeConnection();
};

main().catch(console.error);
