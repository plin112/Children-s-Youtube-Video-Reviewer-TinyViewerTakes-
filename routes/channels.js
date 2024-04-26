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
router.get("/channels", async (req, res) => {
  try {
    let channelsList;
    let message = ''; // Initialize message to an empty string
    const search_term = req.query.search_term;
    const sort = req.query.sort;

    // Check if the search_term parameter is present in the query string
    if ('search_term' in req.query) {
      if (search_term && search_term.trim()) {
        channelsList = await channelData.searchChannels(search_term.trim());
        if (channelsList.length === 0) { // No results found for a valid search
          message = 'No channels found for your search.';
        }
      } else {
        // Message only when search term is present but empty
        message = 'Please enter a search term.';
      }
    } else {
      // The page loads for the first time without any search attempt
      channelsList = await channelData.getAllChannel();
    }

    // Debug for sorting
    console.log("Before sorting:", JSON.stringify(channelsList, null, 2));

    // Sorting based on query parameter
    if (sort) {
      switch(sort) {
        case 'rating':
          channelsList.sort((a, b) => parseFloat(b.averageRating) - parseFloat(a.averageRating));
          break;
        case 'age':
          channelsList.sort((a, b) => parseFloat(b.startingAge) - parseFloat(a.startingAge));
          break;
      }

      // Debug
      console.log("After sorting:", JSON.stringify(channelsList, null, 2));

    }

    channelsList = channelsList.map(channel => ({
      ...channel,
      _id: channel._id.toString() 
    }));

    const isLoggedIn = req.session.user ? true : false;
    res.render("channels", { loggedIn: isLoggedIn, channels: channelsList, message: message, sort: sort });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});
// Handle search and list all channels
router.get("/channels/search", async (req, res) => {
  try {
    const search_term = req.query.search_term;
    validation.validateString(search_term, "search term");

    if (!search_term || !search_term.trim()) {
        res.status(400).json({ message: "Please provide a valid search term." });
        return;
    }

    let channelsList = await channelData.searchChannels(search_term.trim());
    if (channelsList.length === 0) {
        res.json({ message: 'No channels found for your search.', channels: [] });
    } else {
        res.json(channelsList); // assuming this returns an array of channels
    }
} catch (error) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
}
});

router.get("/channels/searchKeyword", async (req, res) => {
  try {
      const search_keyword = req.query.search_keywords;
      //TEST
      //console.log("Search keyword received: ", search_keyword);

      if (!search_keyword || !search_keyword.trim()) {
          res.status(400).render('error', { errorMessage: "Please provide a valid search keyword." });
          return;
      }

      let channelsList = await channelData.searchKeywords(search_keyword.trim());
      //TEST
      // console.log("Channels found:", channelsList);
      // console.log("Number of channels found: ", channelsList.length);

      if (channelsList.length === 0) {
          res.json({ message: 'No channels found matching your keywords.', channels: [] });
      } 
      else {
        res.json(channelsList);
      }
  } catch (error) {
    console.error("Error in searchKeyword route:", error);
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

// POST route to create a new channel
router.post("/channels", async (req, res) => {

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
    if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
        res.status(401).json({redirect: '/login'}); // Send a 401 status with redirect info
    } else {
        res.redirect('/login');
    }
    return;
}

  try {
    validation.validateString(channelTitle, "Channel Title");
    validation.validateString(channelOwnerName, "Channel Owner Name");
    validation.validateString(channelDescription, "Channel Description");
    validation.validateUrl(channelWebsite);
    validation.validateStringArray(keywords, "Keywords");
    validation.validateStringArray(categories, "Categories");
    validation.validateNumber(parseFloat(startingAge), "Starting Age");
    //const keywordsArray = keywords ? keywords.split(',').map(kw => kw.trim()) : [];
    //const categoriesArray = categories ? categories.split(',').map(cat => cat.trim()) : [];

    const newChannel = await channelData.createChannel(
      channelTitle,
      channelOwnerName,
      channelDescription,
      channelWebsite,
      keywords,
      categories,
      parseFloat(startingAge)
    );

    console.log("test")
    const channelsList = await channelData.getAllChannel();
    res.render('channels', { channels: channelsList });
    
  } catch (error) {
    console.error("Error adding new channel:", error);
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
