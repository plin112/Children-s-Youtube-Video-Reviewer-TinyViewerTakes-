import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import * as usersData from "./data/users.js";
import * as channelsData from "./data/channels.js";


app.use(express.json());
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});

// Example function to test user registration
async function testUserRegistration() {
  try {
    // Provide test user data
    const firstName = "John";
    const lastName = "Doe";
    const emailAddress = "john.doe@example.com";
    const password = "testpassword";

    // Register the user
    const result = await usersData.default.registerUser(
      firstName,
      lastName,
      emailAddress,
      password
    );
    console.log("User registered successfully:", result);
  } catch (error) {
    console.error("Error registering user:", error);
  }
}

// Example function to test user login
async function testUserLogin() {
  try {
    // Provide test login credentials
    const emailAddress = "john.doe@example.com";
    const password = "testpassword";

    // Login the user
    const user = await usersData.default.loginUser(emailAddress, password);
    console.log("User logged in successfully:", user);
  } catch (error) {
    console.error("Error logging in user:", error);
  }
}

//TEST: channels/getAllChannel
async function testGetAllChannels() {
  const channelsCollection = await channelsData.getAllChannel();
  console.log(channelsCollection);
}

//TEST: channels/getChannels()
async function testGetChannel(channelId){
  try {
    const channel = await channelsData.getChannel(channelId);
    console.log(channel);

  } catch (error) {
    console.error('Error to get channel: ', error);
  }
};

//TEST: channels/removeChannel()
async function testRemoveChannel(channelId){
  try {
    const deleteChannel = await channelsData.removeChannel(channelId);
    console.log(deleteChannel);

  } catch (error) {
    console.error('Error to remove channel: ', error);
  }
}

//TEST: channels/updateChannel()
async function testUpdateChannel(channelId, updateData) {
    try {
      const channelsCollection = await channelsData.getAllChannel();
      const result = await channelsCollection.updateChannel(
        { _id: new ObjectId(channelId) },
        { $set: updateData }
      )

      if(result.matchedCount === 0) {
        throw 'No channel found with the ID.';
      }


    } catch(error) {
      console.error("Error to update channel: ", error);
    }

}

// Call the test functions
testUserRegistration();
testUserLogin();
// testGetAllChannels();
// testGetChannel('661f2b555062406bfeb5a860');
// testRemoveChannel('661f2b555062406bfeb5a860');
testUpdateChannel({
  channelId: '661f2cad1b4b351f9e04fd5e',
  channelTitle: '',
  channelOwnerName: '',
  channelDescription: 'Official channel for Paw Patrol. We only have some the episodes available.',
  keywords: [],
  categories: []
});
