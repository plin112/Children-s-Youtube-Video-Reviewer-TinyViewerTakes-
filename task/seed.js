import { dbConnection, closeConnection } from "../config/mongoConnection.js";
import { createChannel } from "../data/channels.js";
import { createReview } from "../data/reviews.js";
import exportedMethods from '../data/users.js';

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
  
  try {
    const pawPatrolChannel = await createChannel(
      "Paw Patrol",
      "Paw Patrol Official",
      "Official channel for Paw Patrol. We have all the episodes available. ",
      "youtube.com/pawpatrol",
      ["animal", "toy"],
      ["animation for kids", "cute"]
    );
    console.log("Channel 1 added successfully");
    //console.log(pawPatrolChannel);

    const review1 = await createReview(
      pawPatrolChannel._id.toString(),
      user1._id.toString(),
      "Great Show",
      "My kids love watching this show every afternoon!",
      5
    );
    console.log("Review 1 added successfully to Paw Patrol channel");

  } catch (error) {
    console.error("Error creating channel 1: ", error);
  }

  

  try {
    const peppaPigChannel = await createChannel(
      "Peppa Pig",
      "Peppa Pig Official",
      "Official channel for Peppa Pig.",
      "youtube.com/peppapig",
      ["kids"],
      ["kids"]
    );
    console.log("Channel 2 added successfully");
  } catch (error) {
    console.error("Error creating channel 2: ", error);
  }

  console.log("Done seeding database");
  await closeConnection();
};

main();
