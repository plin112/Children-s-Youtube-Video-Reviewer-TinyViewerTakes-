import {dbConnection, closeConnection} from '../config/mongoConnection.js';
import {createChannel} from '../data/channels.js';

const main = async () => {
  const dababaseSeed = await dbConnection();
  await dababaseSeed.dropDatabase();
  try {
    const pawPatrolChannel= await createChannel(
        {   channelTitle: "Paw Patrol",
            channelOwnerName: "Paw Patrol Fan",
            channelDescription: "This is a kid's channel for Paw Patrol. We have all the episodes available. ",
            keywords:  ["animal", "animation", "kids", ""],
            categories: "animation for kids", "anomal and trucks."
        }
    );
    console.log("Channel 1 added successfully");
    console.log(pawPatrolChannel);
  } catch (error) {
    console.error("Error creating channel: ", error);
  }


  /**
   * const iPhoneM = await createChannel(
    'Apple iPhone 13 mini 512GB - Product Red',
    'The iPhone 13 Mini is the perfect sized smartphone................',
    'MQ3L2ML/A',
    999,
    'Apple',
    'http://www.apple.com',
    ["Cell Phone", "Phone", "iPhone", "Apple", "Smartphone", "iPhone 13", "mini", "smaller smartphones"],
    ["Electronics", "Cell Phones and Accessories", "Cell Phones"],
    "9/24/2021",
    false,
    [{
      title: "Nice color",
      reviewDate: "03/05/2023",
      reviewerName: "Peter Pan",
      review: "very nice color, very fast",
      rating: 5
    }],
    5
  );

  const iPhone14T = await createChannel(
    'Apple iPhone 14 Pro 1TB - Space Grey',
    'The all new iPhone 14 pro has many upgraded features................',
    'MQ2L3LL/A',
    1499,
    'Apple',
    'http://www.apple.com',
    ["Cell Phone", "Phone", "iPhone", "Apple", "Smartphone", "iPhone 14", "pro"],
    ["Electronics", "Cell Phones and Accessories", "Cell Phones"],
    '9/16/2022',
    false,
    [{
      title: "Nice feature",
      reviewDate: "03/05/2020",
      reviewerName: "Panny John",
      review: "very nice color, fast speed",
      rating: 5
    }],
    5.0
  );

  const macBook = await createChannel(
    'Apple macbook pro 13" - silver',
    'This new macbook has m1 chip.',
    'MQ2L13CH/S',
    1505,
    'Apple',
    'http://www.apple.com',
    ["Laptop", "Apple", "M1 chip", "macbook", "pro"],
    ["Electronics", "Computer and Accessories", "Laptop"],
    '08/15/2020',
    false,
    [{
      title: "User friendly",
      reviewDate: "03/20/2023",
      reviewerName: "Joey Frank",
      review: "very nice color, poor screen quality",
      rating: 4
    }],
    4
  );

  const MacMini = await createChannel(
    'Apple macmini" - silver',
    'Mac-mini with M2 chip.',
    'MQ2L13MM/S',
    999,
    'Apple',
    'http://www.apple.com',
    ["Computer", "Apple", "M2 chip", "Mac Mini", "operating system"],
    ["Electronics", "Computer and Accessories"],
    '08/15/2022',
    false,
    [{
      title: "Nice chip",
      reviewDate: "01/06/2023",
      reviewerName: "Sandy",
      review: "fast speed, favor system",
      rating: 5
    }],
    5
  );
   */
  

  console.log('Done seeding database');
  await closeConnection();
};

main();

