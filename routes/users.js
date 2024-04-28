import { Router } from "express";
import { userData } from "../data/index.js";
import validation from "../data/validation.js";

const router = Router();

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect("/channels");
  }
  res.render("register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  let { firstNameInput, lastNameInput, emailAddressInput, passwordInput, confirmPasswordInput } =
    req.body;

  try {
    if (!firstNameInput || !lastNameInput || !emailAddressInput || !passwordInput || !confirmPasswordInput
    ) {
      return res.status(400).send("All fields need to be supplied");
    }

    validation.validateString(firstNameInput, 'First-name');
    if (firstNameInput.length > 25 || firstNameInput.length < 2) {
      return res.status(400).send("First name need to have at least 2 characters long and no more than 25 characters.");
    }
    validation.validateString(lastNameInput, 'Last-name');
    if (lastNameInput.length > 25 || lastNameInput.length < 2) {
      return res.status(400).send("Last name need to have at least 2 characters long and no more than 25 characters.");
    }
    validation.checkEmail(emailAddressInput, 'Email-Address');
    
    // check if password and confirm password match
    validation.checkPassword(passwordInput, 'Password');
    validation.checkPassword(confirmPasswordInput, 'Confirmed-Password');
    if (passwordInput !== confirmPasswordInput) {
      return res.status(400).send("Password does not match.");
    }

    // const saltRounds = 16;
    // const hashedPassword = await bcrypt.hash(registeration.passwordInput, saltRounds);
    const newUser = await registerUser(
      firstNameInput, lastNameInput, emailAddressInput, passwordInput
    );

    console.log('User registered: ', newUser);
    //res.json(newUser);
    // redirect to login if registeration is success
    res.redirect('/login');
    return res.redirect("/login");
  } catch (e) {
    return res.status(400).render("register", {
      error: e.toString(),
      title: "Register",
      data: req.body,
    });
  }
});

router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect("/channels");
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
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    };
    res.redirect("/channels");
  } catch (e) {
    return res.status(400).render("login", {
      error: "Invalid email address or password.",
      title: "Login",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;
