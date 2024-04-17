import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {createChannel} from '../data/channels.js';

const main = async () => {
  const dababaseSeed = await dbConnection();
  await dababaseSeed.dropDatabase();

  try {
    const pawPatrolChannel= await createChannel(
      "Paw Patrol",
      "Paw Patrol Official",
      "Official channel for Paw Patrol. We have all the episodes available. ",
      ["animal", "animation", "kids", "trucks"],
      ["animation for kids", "animal and trucks"]
    );
    console.log("Channel 1 added successfully");
    //console.log(pawPatrolChannel);
  } catch (error) {
    console.error("Error creating channel 1: ", error);
  }
  
  try {
    const peppaPigChannel = await createChannel(
      "Peppa Pig",
      "Peppa Pig Official",
      "Official channel for Peppa Pig.",
      ["kids", "animation", "family", "peppa"],
      ["kids", "entertainment"]
    );
    console.log("Channel 2 added successfully");
  } catch (error) {
    console.error("Error creating channel 2: ", error);
  }

  console.log('Done seeding database');
  await closeConnection();
};

main();

