import { Router } from "express";
const router = Router();
import { channelData } from "../data/index.js";
import validation from "../data/validation.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// POST route to create a new channel
router.post("/Channels", async (req, res) => {
  const {
    channelTitle,
    channelOwnerName,
    channelDescription,
    channelWebsite,
    keywords,
    categories,
    startingAge
  } = req.body;

  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    // validation.validateString(channelTitle, 'Channel Title');
    // validation.validateString(channelOwnerName, 'Channel Owner Name');
    // validation.validateString(channelDescription, 'Channel Description');
    // // validation.validateString(channelWebsite, 'Channel Website');
    // validation.validateStringArray(keywords, 'Keywords');
    // validation.validateStringArray(categories, 'Categories');

    const newChannel = await channelData.createChannel(
      channelTitle,
      channelOwnerName,
      channelDescription,
      channelWebsite,
      keywords,
      categories,
      parseFloat(startingAge)
    );
    // res.status(201).json(newChannel);
    const channelsList = await channelData.getAllChannel();
    res.render("channels", { channels: channelsList });
  } catch (error) {
    res.status(400).json({ error: error.toString() });
  }
});

// GET route to list all channels
router.get("/Channels", async (req, res) => {
  try {
    //        const channelsList = await channelData.getAllChannel();
    //        res.render('channels', { channelsList });
    const channelsList = await channelData.getAllChannel();

    let isLoggedIn = false;

    if (req.session.user) {
      isLoggedIn = true;
    }
  

    res.render("channels", { loggedIn: isLoggedIn, channels: channelsList });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/channels/:channelId", async (req, res) => {
  const { channelId } = req.params;
  try {
    const channel = await channelData.getChannel(channelId);
    console.log("Fetched channel data:", channel);
    if (!channel) {
      res.status(404).json({ error: "Channel not found" });
      return;
    }
    // Pass the entire channel object to the template
    res.render("individualchannel", {
      title: channel.channelTitle, // Optional, sets the document title to the channel's title
      channel: channel, // Pass the entire channel object
    });
  } catch (error) {
    console.error("Error to get channel: ", error);
    res.status(500).json({ error: error.toString() });
  }
});
// // // DELETE route to remove a channel by ID
// // router.delete('/:channelId', async (req, res) => {
// //     const { channelId } = req.params;
// //     try {
// //         const deletionResult = await channelData.removeChannel(channelId);
// //         if (!deletionResult.value) {
// //             return res.status(404).json({ error: 'Channel not found' });
// //         }
// //         res.json({ message: 'Channel successfully deleted' });
// //     } catch (error) {
// //         res.status(500).json({ error: error.toString() });
// //     }
// // });

// // // PUT route to update a channel
// // router.put('/:channelId', async (req, res) => {
// //     const { channelId } = req.params;
// //     const { channelTitle, channelOwnerName, channelDescription, keywords, categories } = req.body;
// //     try {
// //         const updatedChannel = await channelData.updateChannel(
// //             channelId,
// //             channelTitle,
// //             channelOwnerName,
// //             channelDescription,
// //             keywords,
// //             categories
// //         );
// //         res.json(updatedChannel);
// //     } catch (error) {
// //         res.status(400).json({ error: 'Failed to update channel: ' + error.toString() });
// //     }
// });

export default router;
