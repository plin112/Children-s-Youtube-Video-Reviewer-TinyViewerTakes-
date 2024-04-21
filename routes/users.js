import { Router } from "express";
import { reviewData, channelData, userData } from "../data/index.js";
import validation from "../data/validation.js";
const router = Router();

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    return res.redirect("/error?message=Unauthorized Access");
  }
}

router.get("/", (req, res) => {
  //code here for GET THIS ROUTE SHOULD NEVER FIRE BECAUSE OF MIDDLEWARE #1 IN SPECS.
  return res.json({ error: "YOU SHOULD NOT BE HERE!" });
});

router.get("/register", (req, res) => {
  if (req.session.user) {
    const redirectRoute =
      req.session.user.role === "admin" ? "/admin" : "/protected";
    return res.redirect(redirectRoute);
  }
  res.render("register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  let {
    firstNameInput,
    lastNameInput,
    emailAddressInput,
    passwordInput,
    roleInput,
  } = req.body;

  try {
    firstNameInput = validation.checkName(firstNameInput, "First Name");
    lastNameInput = validation.checkName(lastNameInput, "Last Name");
    emailAddressInput = validation.checkEmail(emailAddressInput);
    passwordInput = validation.checkPassword(passwordInput);
    roleInput = validation.checkRole(roleInput);

    const result = await userData.registerUser(
      firstNameInput,
      lastNameInput,
      emailAddressInput,
      passwordInput,
      roleInput
    );
    console.log("User registered successfully:", result);

    if (result.userInserted) {
      return res.redirect("/login");
    } else {
      throw new Error("Unexpected error occurred during registration.");
    }
  } catch (e) {
    console.error(e);
    return res.status(400).render("register", {
      error: e.toString(),
      title: "Register",
      data: req.body,
    });
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect(redirectRoute);
  }
  res.render("login", { title: "Login" });
});

router.post("/login", async (req, res) => {
  let { emailAddressInput, passwordInput } = req.body;

  try {
    validation.checkEmail(emailAddressInput);
    validation.checkPassword(passwordInput);
    const user = await userData.loginUser(emailAddressInput, passwordInput);

    req.session.user = {
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      role: user.role,
    };
    res.redirect(user.role === "admin" ? "/admin" : "/protected");
  } catch (e) {
    return res.status(400).render("login", {
      error: "Invalid email address or password.",
      title: "Login",
    });
  }
});

router.get("/protected", isAuthenticated, (req, res) => {
  res.render("protected", {
    firstName: req.session.user.firstName,
    lastName: req.session.user.lastName,
    currentTime: new Date().toUTCString(),
    role: req.session.user.role,
  });
});

router.get("/admin", isAuthenticated, isAdmin, (req, res) => {
  res.render("admin", {
    firstName: req.session.user.firstName,
    lastName: req.session.user.lastName,
    currentTime: new Date().toUTCString(),
    role: req.session.user.role,
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

router.get("/error", (req, res) => {
  const message = req.query.message || "An unexpected error occurred.";
  res.status(400).render("error", { errorMessage: message });
});

export default router;
