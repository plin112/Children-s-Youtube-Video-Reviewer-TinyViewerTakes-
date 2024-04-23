import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createChannel } from "../data/channels.js";
import { createReview } from "../data/reviews.js";
import exportedMethods from '../data/users.js';
import {createComment, getAllComments, getComment} from '../data/comment.js'

const main = async () => {
  const dababaseSeed = await dbConnection();
  await dababaseSeed.dropDatabase();

  let user1;

  try {
    user1 = await exportedMethods.registerUser('John', 'Doe', 'john.doe@example.com', 'Password123!');
    console.log("User 1 added successfully");
  } catch (error) {
    console.error("Error creating user 1: ", error);
  }
  let review1;

  try {
    const pawPatrolChannel = await createChannel(
      "Paw Patrol",
      "Paw Patrol Official",
      "Official channel for Paw Patrol. We have all the episodes available. ",
      "youtube.com/pawpatrol",
      ["animal", "toy"],
      ["animation for kids", "cute"],
      2
    );
    console.log("Channel 1 added successfully");

    review1 = await createReview(
      pawPatrolChannel._id.toString(),
      user1._id.toString(),
      "Great Show",
      "My kids love watching this show every afternoon!",
      5
    );
    console.log("Review 1 added successfully to Paw Patrol channel");

    // Add a comment to the review
    const comment1 = await createComment(
      pawPatrolChannel._id.toString(),
      review1._id.toString(),
      user1._id.toString(),
      "Absolutely love it!"
    );
    console.log("Comment 1 added successfully to Review 1");

  } catch (error) {
    console.error("Error creating channel or review: ", error);
  }

  try {
    const peppaPigChannel = await createChannel(
      "Peppa Pig",
      "Peppa Pig Official",
      "Official channel for Peppa Pig.",
      "youtube.com/peppapig",
      ["kids"],
      ["kids"],
      1
    );
    console.log("Channel 2 added successfully");
  } catch (error) {
    console.error("Error creating channel 2: ", error);
  }

  try {
    const animalKingdomChannel = await createChannel(
      "Animal Kingdom",
      "Animal Kingdom Official",
      "Official channel for Animal Kingdom.",
      "youtube.com/animalkingdom",
      ["animal"],
      ["kids"],
      2
    );
    console.log("Channel 3 added successfully");
  } catch (error) {
    console.error("Error creating channel 3: ", error);
  }

  try {
    const babySharkChannel = await createChannel(
      "Baby Shark",
      "Baby Shark Official",
      "Official channel for Baby Shark.",
      "youtube.com/babyshark",
      ["kids", "shark family"],
      ["kids", "animal"],
      1
    );
    console.log("Channel 4 added successfully");
  } catch (error) {
    console.error("Error creating channel 4: ", error);
  }


  console.log("Done seeding database");
  await closeConnection();
};

main();
