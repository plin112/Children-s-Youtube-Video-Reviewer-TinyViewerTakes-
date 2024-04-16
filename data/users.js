//import mongo collections, bcrypt and implement the following data functions

import bcrypt from "bcryptjs";
// import validation from "../helpers.js";
import { users } from "../config/mongoCollections.js";

let exportedMethods = {
  async registerUser(firstName, lastName, emailAddress, password) {
    // (firstName = validation.checkName(firstName, "First Name")),
    //   (lastName = validation.checkName(lastName, "Last Name")),
    //   (emailAddress = validation.checkEmail(emailAddress)),
    //   (password = validation.checkPassword(password));

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
    };
    let insertData = await usersCollection.insertOne(newUser);
    if (insertData.acknowledged === 0 || !insertData.insertedId === 0)
      throw "Could Not Add User!";

    // console.log(newUser);

    return { userInserted: true };
  },

  async loginUser(emailAddress, password) {
    // validation.checkEmail(emailAddress);
    // validation.checkPassword(password);

    const usersCollection = await users();

    emailAddress = emailAddress.trim().toLowerCase();

    const user = await usersCollection.findOne({ emailAddress: emailAddress });
    if (!user) {
      throw "Error: Either the email address or password is invalid.";
    }

    const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatches) {
      throw "Error: Either the email address or password is invalid.";
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    };
  },
};

export default exportedMethods;
