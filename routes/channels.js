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
    return res
      .status(400)
      .render("error", {
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









// import { Router } from "express";
// const router = Router();
// import { channelData } from "../data/index.js";
// import validation from "../data/validation.js";
// import path from "path";
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// router.get("/", async (req, res) => {
//   try {
//     res.redirect("/Channels");
//   } catch (error) {
//     res.status(500).json({ error: error.toString() });
//   }
// });
// router.get('/search', async (req, res) => {
//   try {
//     const query = req.query.q;
//     const searchResults = await channelData.searchChannels(query);
//     res.json(searchResults);
//   } catch (error) {
//     res.status(500).json({ error: `Search failed: ${error}` });
//   }
// });


// // POST route to create a new channel
// router.post("/Channels", async (req, res) => {
//   const {
//     channelTitle,
//     channelOwnerName,
//     channelDescription,
//     channelWebsite,
//     keywords,
//     categories,
//     startingAge,
//   } = req.body;

//   if (!req.session || !req.session.user) {
//     return res.redirect("/login");
//   }

//   try {
//     validation.validateString(channelTitle, "Channel Title");
//     validation.validateString(channelOwnerName, "Channel Owner Name");
//     validation.validateString(channelDescription, "Channel Description");
//     validation.validateString(channelWebsite, "Channel Website");
//     validation.validateStringArray(keywords, "Keywords");
//     validation.validateStringArray(categories, "Categories");

//     const newChannel = await channelData.createChannel(
//       channelTitle,
//       channelOwnerName,
//       channelDescription,
//       channelWebsite,
//       keywords,
//       categories,
//       parseFloat(startingAge)
//     );
//     // res.status(201).json(newChannel);
//     const channelsList = await channelData.getAllChannel();
//     res.render("channels", { channels: channelsList });
//   } catch (error) {
//     // res.status(400).json({ error: error.toString() });
//     return res
//       .status(400)
//       .render("error", {
//         errorMessage:
//           "Supply all fields: All must be string values withouts paces except for Age Range should be integer",
//       });
//   }
// });

// // GET route to list all channels
// router.get("/Channels", async (req, res) => {
//   try {
//     //        const channelsList = await channelData.getAllChannel();
//     //        res.render('channels', { channelsList });
//     const channelsList = await channelData.getAllChannel();

//     let isLoggedIn = false;

//     if (req.session.user) {
//       isLoggedIn = true;
//     }

//     res.render("channels", { loggedIn: isLoggedIn, channels: channelsList });
//   } catch (error) {
//     res.status(500).json({ error: error.toString() });
//   }
// });

// router.get("/channels/:channelId", async (req, res) => {
//   const { channelId } = req.params;
//   try {
//     const channel = await channelData.getChannel(channelId);
//     console.log("Fetched channel data:", channel);
//     if (!channel) {
//       res.status(404).json({ error: "Channel not found" });
//       return;
//     }
//     // Pass the entire channel object to the template
//     res.render("individualchannel", {
//       title: channel.channelTitle, // Optional, sets the document title to the channel's title
//       channel: channel, // Pass the entire channel object
//     });
//   } catch (error) {
//     console.error("Error to get channel: ", error);
//     res.status(500).json({ error: error.toString() });
//   }
// });
// // // // DELETE route to remove a channel by ID
// // // router.delete('/:channelId', async (req, res) => {
// // //     const { channelId } = req.params;
// // //     try {
// // //         const deletionResult = await channelData.removeChannel(channelId);
// // //         if (!deletionResult.value) {
// // //             return res.status(404).json({ error: 'Channel not found' });
// // //         }
// // //         res.json({ message: 'Channel successfully deleted' });
// // //     } catch (error) {
// // //         res.status(500).json({ error: error.toString() });
// // //     }
// // // });

// // // // PUT route to update a channel
// // // router.put('/:channelId', async (req, res) => {
// // //     const { channelId } = req.params;
// // //     const { channelTitle, channelOwnerName, channelDescription, keywords, categories } = req.body;
// // //     try {
// // //         const updatedChannel = await channelData.updateChannel(
// // //             channelId,
// // //             channelTitle,
// // //             channelOwnerName,
// // //             channelDescription,
// // //             keywords,
// // //             categories
// // //         );
// // //         res.json(updatedChannel);
// // //     } catch (error) {
// // //         res.status(400).json({ error: 'Failed to update channel: ' + error.toString() });
// // //     }
// // });

// export default router;
