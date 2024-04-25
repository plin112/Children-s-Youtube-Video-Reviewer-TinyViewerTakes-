// (function ($) {
//     let searchForm = $("#searchForm"),
//       searchTermInput = $("#search_term"),
//       channelList = $("#channelList"),
//       addChannelForm = $("#addChannelForm"),
//       addReviewForm = $("#addReviewForm");
  
//     function bindEventsToChannelItem() {
//       channelList.on("click", "a", function (event) {
//         event.preventDefault();
//         let channelId = $(this).data("id"); // Retrieve the channel ID stored in data-id attribute
//         // Redirect to the individual channel page using the channel ID
//         window.location.href = `http://localhost:3000/channels/${channelId}`;
//       });
//     }
  
//     function loadChannels() {
//       $.ajax({
//         method: "GET",
//         url: "/channels",
//         success: function (channels) {
//           channelList.empty(); // Clear previous entries
//           channels.forEach(function (channel) {
//             // Create links with correct href attribute and data-id for each channel
//             const link = $(
//               '<a href="javascript:void(0);" data-id="' + channel._id + '">'
//             ).text(channel.channelTitle);
//             const listItem = $("<li>").append(link);
//             channelList.append(listItem);
//           });
//           bindEventsToChannelItem(); // Bind click event handlers to the new links
//         },
//         error: function () {
//           alert("Error fetching channels.");
//         },
//       });
//     }
  
//     searchForm.submit(function (event) {
//       event.preventDefault();
//       let searchQuery = $.trim(searchTermInput.val());
//       if (!searchQuery || searchQuery.trim() === "") {
//         $.ajax({
//           method: "GET",
//           url: "/Channels/search",
//           success: function () {
//             // Success callback: reload the page
//             window.location.reload();
//           },
//           error: function () {
//             // Error callback: handle error, such as displaying an alert
//             alert("Error navigating to search page.");
//           },
//         });
//         return;
//       }
//       $.ajax({
//         method: "GET",
//         url: `/channels/search?q=${encodeURIComponent(searchQuery)}`,
//         success: function (channels) {
//           channelList.empty(); // Clear list before adding search results
//           channels.forEach(function (channel) {
//             const link = $(
//               '<a href="javascript:void(0);" data-id="' + channel._id + '">'
//             ).text(channel.channelTitle);
//             const listItem = $("<li>").append(link);
//             channelList.append(listItem);
//           });
//           bindEventsToChannelItem(); // Rebind click events to new links
//         },
//         error: function () {
//           alert("Error searching channels.");
//         },
//       });
//     });
  
//     // Add channel form submission using the original functionality
//     addChannelForm.submit(function (event) {
//       event.preventDefault();
//       let formData = {
//         channelTitle: $("#channelTitle").val(),
//         channelOwnerName: $("#channelOwnerName").val(),
//         channelDescription: $("#channelDescription").val(),
//         channelWebsite: $("#channelWebsite").val(),
//         keywords: $("#keywords").val(),
//         categories: $("#categories").val(),
//       };
  
//       $.ajax({
//         method: "POST",
//         url: "/channels",
//         data: formData,
//         success: function (response) {
//           // Optionally alert the user or handle UI updates
//           alert("Channel added successfully.");
//           loadChannels(); // Reload channels to show the new addition
//         },
//         error: function (error) {
//           alert("Error adding new channel");
//         },
//       });
//     });
  
//     $(document).ready(function () {
//       // Handle click event for remove review button
//       $(document).on("click", ".remove-review", function () {
//         console.log("test here?");
//         const reviewId = $(this).data("review-id");
  
//         const urlParts = window.location.pathname.split("/"); // Split URL by '/'
//         const channelId = urlParts[2]; // Assuming channelId is the third segment of the URL
  
//         // Make AJAX request to delete the review
//         $.ajax({
//           url: `/channels/${channelId}`,
//           method: "DELETE",
//           data: { reviewId: reviewId },
//           success: function (response) {
//             // Handle success response
//             $(`li[data-review-id="${reviewId}"]`).remove(); // Remove the review element from the DOM
//             alert("Review removed successfully");
//           },
//           error: function (error) {
//             alert("Error removing review");
//           },
//         });
//       });
//     });
  
//     loadChannels(); // Load channels on page load
//   })(window.jQuery);