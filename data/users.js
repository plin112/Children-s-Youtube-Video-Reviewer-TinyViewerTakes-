//import mongo collections, bcrypt and implement the following data functions

import bcrypt from "bcryptjs";
import * as validation from "./validation.js";
import { users } from "../config/mongoCollections.js";

let exportedMethods = {
  async registerUser(firstName, lastName, emailAddress, password) {
    //Validate input
    validation.default.validateString(firstName, "first name");
    validation.default.validateString(lastName, "last name");
    validation.default.checkEmail(emailAddress);
    validation.default.checkPassword(password);

    const usersCollection = await users();
    const count = await usersCollection.countDocuments();
    if (count !== 0) {
      const findEmail = await usersCollection.findOne({
        emailAddress: emailAddress,
      });
      if (findEmail !== null) throw "Error! Email Address already exists!";
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailAddress: emailAddress.trim().toLowerCase(),
      hashedPassword: hashedPassword,
      reviews: [],
    };
    let insertData = await usersCollection.insertOne(newUser);
    if (insertData.acknowledged === 0 || !insertData.insertedId === 0)
      throw "Could Not Add User!";

    return newUser;
  },

  async loginUser(emailAddress, password) {
    //Validate input
    validation.default.checkEmail(emailAddress);
    validation.default.checkPassword(password);

    const usersCollection = await users();

    emailAddress = emailAddress.trim().toLowerCase();

    const user = await usersCollection.findOne({ emailAddress: emailAddress });
    if (!user) {
      throw "Error: Email is invalid.";
    }

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatches) {
      throw "Error: Password is invalid.";
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      reviews: [],
    };
  },
};

export default exportedMethods;
