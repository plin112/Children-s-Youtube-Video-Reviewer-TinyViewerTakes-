import { channels } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';
import validation from './validation.js';

const getChannelCollection = async () => { return await channels(); }

//set password for collection or user?
//for channelOwnerName, separate first name and last name?
const create = async (
  channelTitle,
  channelOwnerName,
  channelDescription,
  channelWebsite,
  keywords,
  categories
) => {
  if (!channelTitle ||
    !channelOwnerName ||
    !channelDescription ||
    !channelWebsite ||
    !keywords ||
    !categories
  ) throw 'All fields need to be supplied';

  // validations
  validation.validateString(channelTitle, 'channel-title');
  validation.validateString(channelOwnerName, 'channel-username');
  validation.validateString(channelDescription, 'channel-description');
  validation.validateUrl(channelWebsite);
  validation.validateStringArray(keywords, 'keywords');
  validation.validateStringArray(categories, 'categories');

  // Declare new channel
  const newChannel = {
    channelTitle,
    channelOwnerName,
    channelDescription,
    channelWebsite,
    keywords,
    categories,
    reviews: [],
    averageRating: 0
  };

  // Insert the new channel into the database
  const channelCollection = await getChannelCollection();
  try {
    const insertResult = await channelCollection.insertOne(newChannel);
    return {
      ...newChannel,
      _id: insertResult.insertedId,
    }
  } catch (e) {
    throw `Error inserting channel: ${e.message}`;
  }
};

export { create };