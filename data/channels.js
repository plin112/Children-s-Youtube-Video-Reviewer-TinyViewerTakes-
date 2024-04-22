import { channels } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./validation.js";

const getChannelCollection = async () => {
  return await channels();
};

const createChannel = async (
  channelTitle,
  channelOwnerName,
  channelDescription,
  website,
  keywords,
  categories
) => {
  if (
    !channelTitle ||
    !channelOwnerName ||
    !channelDescription ||
    !website ||
    !keywords ||
    !categories
  )
    throw "All fields need to be supplied";

  // validations
  validation.validateString(channelTitle, "channel-title");
  validation.validateString(channelOwnerName, "channel-description");
  validation.validateString(channelDescription, "channel-description");
  validation.validateUrl(website);
  validation.validateStringArray(keywords, "keywords");
  validation.validateStringArray(categories, "categories");

  // Declare new channel
  const newChannel = {
    channelTitle,
    channelOwnerName,
    channelDescription,
    website,
    keywords,
    categories,
    reviews: [],
    averageRating: 0,
  };

  // Insert the new channel into the database
  const channelCollection = await getChannelCollection();
  try {
    const insertResult = await channelCollection.insertOne(newChannel);
    return {
      ...newChannel,
      _id: insertResult.insertedId,
    };
  } catch (e) {
    throw `Error inserting channel: ${e.message}`;
  }
};

const getAllChannel = async () => {
  const channelCollection = await getChannelCollection();
  const channelList = await channelCollection
    .find({}, { projection: { _id: 1, channelTitle: 1 } })
    .toArray();
  console.log(channelList);
  return channelList;
};

//getChannel by ID
const getChannel = async (channelId) => {
  //validation: channelId
  // channelId = validation.validateId(channelId);

  //get product
  const channelCollection = await getChannelCollection();
  const channel = await channelCollection.findOne({
    _id: new ObjectId(channelId),
  });
  if (!channel) throw "No product with that id";

  return channel;
};

//REMOVE?
//only for channel owner is authorizec to remove channel
const removeChannel = async (channelId) => {
  //validation: productId
  channelId = validation.validateId(channelId);

  const channelCollection = await getChannelCollection();
  const deletionInfo = await channelCollection.findOneAndDelete({
    _id: new ObjectId(channelId),
  });

  if (!deletionInfo)
    throw `Error: Could not delete product with id of ${channelId}`;

  return { ...deletionInfo, deleted: true };
};

//updating channel's keyword amd categories??
//only for authorized channel user
const updateChannel = async (
  channelId,
  channelTitle,
  channelOwnerName,
  channelDescription,
  website,
  keywords,
  categories
) => {
  if (
    !channelId ||
    !channelTitle ||
    !channelOwnerName ||
    !channelDescription ||
    !website ||
    !keywords ||
    !categories
  )
    throw "All fields need to be supplied";

  // validations
  validation.validateId(channelId, "channel-id");
  validation.validateString(channelTitle, "channel-title");
  validation.validateString(channelOwnerName, "channel-description");
  validation.validateString(channelDescription, "channel-description");
  validation.validateUrl(website);
  validation.validateStringArray(keywords, "keywords");
  validation.validateStringArray(categories, "categories");

  const updatedChannel = {
    channelTitle,
    channelOwnerName,
    channelDescription,
    website,
    keywords,
    categories,
  };

  // update the product in the database
  const channelCollection = await getChannelCollection();
  const updateResult = await channelCollection.findOneAndUpdate(
    { _id: new ObjectId(channelId) },
    { $set: updatedChannel },
    { returnDocument: "after" }
  );

  if (!updateResult) {
    throw "Failed to update channel into the database";
  }

  return updateResult;
};

export {
  createChannel,
  getAllChannel,
  getChannel,
  removeChannel,
  updateChannel,
};
