import express from "express";
const app = express();
import configRoutes from "./routes/index.js";
import * as usersData from "./data/users.js";

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

// Call the test functions
testUserRegistration();
testUserLogin();
