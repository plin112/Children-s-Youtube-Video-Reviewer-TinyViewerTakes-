import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";

const exportedMethods = {
  async create(userName) {
    // Error Checking
    // Create a new user object
    let newUser = {
      _id: new ObjectId(),
      userName: userName,
    };

    // Insert into collection
    const usersCollection = await users();
    const insertInfo = await usersCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add user";

    const newId = insertInfo.insertedId.toString();

    return newUser;
  },
};

export default exportedMethods;
