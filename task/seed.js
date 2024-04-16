import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {createChannel} from '../data/channels.js';

const main = async () => {
  const dababaseSeed = await dbConnection();
  await dababaseSeed.dropDatabase();

  try {
    const pawPatrolChannel= await createChannel({
      channelTitle: "Paw Patrol",
      channelOwnerName: "Paw Patrol Fan",
      channelDescription: "Official channel for Paw Patrol. We have all the episodes available. ",
      keywords:  ["animal", "animation", "kids", "trucks"],
      categories: ["animation for kids", "animal and trucks"]
    })
    console.log("Channel 1 added successfully");
    console.log(pawPatrolChannel);
  } catch (error) {
    console.error("Error creating channel: ", error);
  }
  
  const peppaPigChannel = await createChannel({
    channelTitle: "Peppa Pig",
    channelOwnerName: "Peppa Pig Official",
    channelDescription: "Official channel for Peppa Pig.",
    keywords: ["kids", "animation", "family", "peppa"],
    categories: ["kids", "entertainment"]
  });

  console.log('Done seeding database');
  await closeConnection();
};

main();

