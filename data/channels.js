import { channels } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import validation from "./validation.js";

const getChannelCollection = async () => {
  return await channels();
};
const searchChannels = async (query) => {
  try {
    if (!query || query.trim() === "") {
      console.log("I can reach here");
    }
    validation.validateString(query, "search term");
    const channelCollection = await getChannelCollection();
    return await channelCollection
      .find({
        $or: [
          { channelTitle: { $regex: new RegExp(query, "i") } }, // Case-insensitive regex search on channelTitle
          { channelDescription: { $regex: new RegExp(query, "i") } }, // Case-insensitive regex search on channelDescription
        ],
      })
      .toArray();
  } catch (error) {
    res.status(500).render("error", { errorMessage: error.toString() });
  }
};

const searchKeywords = async (word) => {
  try {
    if (!word || word.trim() === "") {
      console.log("Search input cannot be empty");
      return [];
    }
    validation.validateString(word, "search keywords");
    const channelCollection = await getChannelCollection();
    return await channelCollection.find(
      {keywords: { $in: [new RegExp(word, 'i')] }})
      .toArray();
  } catch (error) {
    rconsole.error("Error in searchKeywords:", error);
    throw new Error("Database operation failed");
  }
}

const createChannel = async (
  channelTitle,
  channelOwnerName,
  channelDescription,
  website,
  keywords,
  categories,
  startingAge
) => {
  if (
    !channelTitle ||
    !channelOwnerName ||
    !channelDescription ||
    !website ||
    !keywords ||
    !categories ||
    !startingAge
  )
    throw "All fields need to be supplied";

  // validations
  validation.validateString(channelTitle, "channel-title");
  validation.validateString(channelOwnerName, "channel-description");
  validation.validateString(channelDescription, "channel-description");
  validation.validateUrl(website);
  validation.validateStringArray(keywords, "keywords");
  validation.validateStringArray(categories, "categories");
  validation.validateNumber(startingAge, "Starting Age");

  // Obtain connection to channel collection.
  const channelCollection = await getChannelCollection();

  // Check if a channel with the same title or website already exists
  const existingChannel = await channelCollection.findOne({
    $or: [{ channelTitle: channelTitle }, { website: website }]
  });

  if (existingChannel) {
    if (existingChannel.channelTitle === channelTitle) {
      throw new Error("A channel with the same title already exists.");
    }
    if (existingChannel.website === website) {
      throw new Error("A channel with the same website already exists.");
    }
  }

  // Declare new channel
  const newChannel = {
    channelTitle,
    channelOwnerName,
    channelDescription,
    website,
    keywords,
    categories,
    startingAge,
    reviews: [],
    averageRating: 0,
  };

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
    .find({}, { projection: { _id: 1, channelTitle: 1, averageRating: 1, startingAge: 1, keywords: 1, categories: 1 } })
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
    _id: new ObjectId(channelId)
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
  categories,
  startingAge
) => {
  if (
    !channelId ||
    !channelTitle ||
    !channelOwnerName ||
    !channelDescription ||
    !website ||
    !keywords ||
    !categories ||
    !startingAge
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
  validation.validateNumber(startingAge, "Starting Age");

  const updatedChannel = {
    channelTitle,
    channelOwnerName,
    channelDescription,
    website,
    keywords,
    categories,
    startingAge,
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
  searchChannels,
  searchKeywords
};
