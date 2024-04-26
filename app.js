import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import * as usersData from "./data/users.js";
import * as channelsData from "./data/channels.js";
import * as reviewsData from "./data/reviews.js";
import { dbConnection } from "./config/mongoConnection.js";
import session from "express-session";
import exphbs from "express-handlebars";

// const db = await dbConnection();
//await db.dropDatabase();
app.use(express.json());

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  helpers: {
    eq: function (v1, v2) {
      return v1 === v2;
    },
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number") {
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
      }
      return new Handlebars.SafeString(JSON.stringify(obj));
    },
  },
});

app.use('/public', express.static('public'));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "AuthState",
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, 
      maxAge: 3600000 
    }
  })
);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");

app.use((req, res, next) => {
  const isAuthenticated = req.session.user
    ? "Authenticated User"
    : "Non-Authenticated User";
  console.log(
    `[${new Date().toUTCString()}]: ${req.method} ${
      req.originalUrl
    } (${isAuthenticated})`
  );
  next();
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000/channels");
});

let newChannel;
let newUser;
// //Example function to test user registration

// // async function testUserRegistration() {
// //   try {
// //     // Provide test user data
// //     const firstName = "John";
// //     const lastName = "Doe";
// //     const emailAddress = "john.doe@example.com";
// //     const password = "Testpassword1!";

// //     // Register the user
// //     newUser = await usersData.default.registerUser(
// //       firstName,
// //       lastName,
// //       emailAddress,
// //       password
// //     );
// //     console.log("User registered successfully:", newUser);
// //   } catch (error) {
// //     console.error("Error registering user:", error);
// //   }
// // }

// // // Example function to test user login
// // async function testUserLogin() {
// //   try {
// //     // Provide test login credentials
// //     const emailAddress = "john.doe@example.com";
// //     const password = "Testpassword1!";

// //     // Login the user
// //     const user = await usersData.default.loginUser(emailAddress, password);
// //     console.log("User logged in successfully:", user);
// //   } catch (error) {
// //     console.error("Error logging in user:", error);
// //   }
// // }

// // //TEST: channels/getAllChannel
// // async function testGetAllChannels() {
// //   const channelsCollection = await channelsData.getAllChannel();
// //   console.log(channelsCollection);
// // }

// // //TEST: channels/getChannels()
// // async function testGetChannel(channelId) {
// //   try {
// //     const channel = await channelsData.getChannel(channelId);
// //     console.log(channel);
// //   } catch (error) {
// //     console.error("Error to get channel: ", error);
// //   }
// // }

// // //TEST: channels/removeChannel()
// // async function testRemoveChannel(channelId) {
// //   try {
// //     const deleteChannel = await channelsData.removeChannel(channelId);
// //     console.log(deleteChannel);
// //   } catch (error) {
// //     console.error("Error to remove channel: ", error);
// //   }
// // }

// // //TEST: channels/updateChannel()
// // async function testUpdateChannel(channelId, updateData) {
// //   try {
// //     const result = await channelsData.updateChannel(
// //       channelId,
// //       updateData.channelTitle,
// //       updateData.channelOwnerName,
// //       updateData.channelDescription,
// //       updateData.keywords,
// //       updateData.categories
// //     );
// //     console.log("Update successfully! Result: ", result);
// //   } catch (error) {
// //     console.error("Error to update channel: ", error);
// //   }
// // }

// // // Example function to test channel creation
// async function testCreateChannel() {
//   try {
//     // Provide test data for creating a new channel
//     const channelTitle = "My Channel";
//     const channelOwnerName = "John Doe";
//     const channelDescription = "This is my test channel";
//     const keywords = ["test", "channel", "example"];
//     const categories = ["test", "example"];

//     // Create the new channel
//     newChannel = await channelsData.createChannel(
//       channelTitle,
//       channelOwnerName,
//       channelDescription,
//       keywords,
//       categories
//     );

//     console.log("Channel created successfully:", newChannel);
//     console.log("channel name:" + newChannel.channelTitle);
//     console.log("channel id:" + newChannel._id);
//   } catch (error) {
//     console.error("Error creating channel:", error);
//   }
// }

// // Example function to test creating a review
// async function testCreateReview() {
//   try {
//     // Provide test data for creating a new review
//     // console.log("******test***:" + newChannel._id);
// const channelId = newChannel._id.toString(); // Replace with a valid channel ID
// const userId = newUser._id.toString(); // Replace with a valid user ID
// const title = "Great Channel!";
// const reviewerName = "John Doe";
// const reviewText = "I really enjoyed this channel. Great content!";
// const rating = 5;

//     // Create the new review
//     const newReview = await reviewsData.createReview(
//       channelId,
//       userId,
//       title,
//       reviewerName,
//       reviewText,
//       rating
//     );

//     console.log("Review created successfully:", newReview);
//   } catch (error) {
//     console.error("Error creating review:", error);
//   }
// }

// // Call the test functions
// async function runTests() {
//   await testCreateChannel();
//   await testUserRegistration();
//   await testCreateReview();
// }
// runTests();
