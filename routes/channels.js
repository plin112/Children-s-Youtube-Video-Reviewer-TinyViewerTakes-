import { Router } from "express";
import { channelData } from "../data/index.js";
import validation from "../data/validation.js";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Redirect to the canonical channels route
router.get("/", async (req, res) => {
  try {
    res.redirect("/Channels");
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// Handle search and list all channels
router.get("/Channels", async (req, res) => {
  try {
    let channelsList;
    // validation.validateString(req.query.search_term, "search term");
    if (req.query.search_term) {
      channelsList = await channelData.searchChannels(req.query.search_term);
    } else {
      channelsList = await channelData.getAllChannel();
    }
    let isLoggedIn = req.session.user ? true : false;
    res.render("channels", { loggedIn: isLoggedIn, channels: channelsList });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

// // Handle search and list all channels
// router.get("/Channels/search", async (req, res) => {
//   try {
//     let channelsList;
//     validation.validateString(req.query.search_term, "search term");
//   } catch (error) {
//     res.status(500).render("error", { errorMessage: error.toString() });
//   }
// });

// POST route to create a new channel
router.post("/Channels", async (req, res) => {
  const {
    channelTitle,
    channelOwnerName,
    channelDescription,
    channelWebsite,
    keywords,
    categories,
    startingAge,
  } = req.body;

  if (!req.session || !req.session.user) {
    return res.redirect("/login");
  }

  try {
    validation.validateString(channelTitle, "Channel Title");
    validation.validateString(channelOwnerName, "Channel Owner Name");
    validation.validateString(channelDescription, "Channel Description");
    validation.validateUrl(channelWebsite);
    //validation.validateStringArray(keywords, "Keywords");
    //validation.validateStringArray(categories, "Categories");
    //validation.validateNumber(parseFloat(startingAge), "Starting Age");

    const newChannel = await channelData.createChannel(
      channelTitle,
      channelOwnerName,
      channelDescription,
      channelWebsite,
      keywords,
      categories,
      parseFloat(startingAge)
    );

    const channelsList = await channelData.getAllChannel();
    res.render("channels", { channels: channelsList });
  } catch (error) {
    return res.status(400).render("error", {
      errorMessage: "Supply all fields properly.",
    });
  }
});

// GET route to get a specific channel by ID
router.get("/channels/:channelId", async (req, res) => {
  const { channelId } = req.params;
  try {
    const channel = await channelData.getChannel(channelId);
    if (!channel) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }
    res.render("individualchannel", {
      title: channel.channelTitle,
      channel: channel,
    });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

export default router;
