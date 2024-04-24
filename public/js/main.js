// (function ($) {
//   let searchForm = $("#searchForm"),
//     searchTermInput = $("#search_term"),
//     channelList = $("#channelList");
//   addChannelForm = $("#addChannelForm");
//   addReviewForm = $("#addReviewForm");

//   function bindEventsToChannelItem() {
//     // Use event delegation to handle clicks on dynamically created links
//     channelList.on("click", "a", function (event) {
//       event.preventDefault();
//       let channelId = $(this).data("id"); // Retrieve the channel ID stored in data-id attribute
//       // Redirect to the individual channel page using the channel ID
//       window.location.href = `http://localhost:3000/channels/${channelId}`;
//     });
//   }

//   function loadChannels() {
//     $.ajax({
//       method: "GET",
//       url: "/channels",
//       success: function (channels) {
//         channelList.empty(); // Clear previous entries
//         channels.forEach(function (channel) {
//           // Create links with correct href attribute and data-id for each channel
//           const link = $(
//             '<a href="javascript:void(0);" data-id="' + channel._id + '">'
//           ).text(channel.channelTitle);
//           const listItem = $("<li>").append(link);
//           channelList.append(listItem);
//         });
//         bindEventsToChannelItem(); // Bind click event handlers to the new links
//       },
//       error: function () {
//         alert("Error fetching channels.");
//       },
//     });
//   }

  // searchForm.submit(function (event) {
  //   event.preventDefault();
  //   let searchQuery = $.trim(searchTermInput.val());
  //   if (!searchQuery) {
  //     alert("Please enter a valid search term.");
  //     return;
  //   }

  //   $.ajax({
  //     method: "GET",
  //     url: `/channels/search?q=${encodeURIComponent(searchQuery)}`,
  //     success: function (channels) {
  //       channelList.empty(); // Clear list before adding search results
  //       channels.forEach(function (channel) {
  //         const link = $(
  //           '<a href="javascript:void(0);" data-id="' + channel._id + '">'
  //         ).text(channel.channelTitle);
  //         const listItem = $("<li>").append(link);
  //         channelList.append(listItem);
  //       });
  //       bindEventsToChannelItem(); // Rebind click events to new links
  //     },
  //     error: function () {
  //       alert("Error searching channels.");
  //     },
  //   });
  // });
  

//   (function ($) {
//     let searchForm = $("#searchForm"),
//         searchTermInput = $("#search_term"),
//         channelList = $("#channelList"),
//         addChannelForm = $("#addChannelForm"),
//         addReviewForm = $("#addReviewForm");

//     function bindEventsToChannelItem() {
//         channelList.on("click", "a", function (event) {
//             event.preventDefault();
//             let channelId = $(this).data("id");
//             window.location.href = `/channels/${channelId}`;
//         });
//     }

//     function loadChannels() {
//         $.ajax({
//             method: "GET",
//             url: "/channels",
//             success: function (channels) {
//                 channelList.empty();
//                 channels.forEach(function (channel) {
//                     const link = $('<a href="javascript:void(0);" data-id="' + channel._id + '">').text(channel.channelTitle);
//                     const listItem = $("<li>").append(link);
//                     channelList.append(listItem);
//                 });
//                 bindEventsToChannelItem();
//             },
//             error: function () {
//                 alert("Error fetching channels.");
//             },
//         });
//     }

//     searchForm.submit(function (event) {
//         event.preventDefault();
//         let searchQuery = $.trim(searchTermInput.val());
//         if (!searchQuery) {
//             alert("Please enter a valid search term.");
//             return;
//         }

//         $.ajax({
//             method: "GET",
//             url: `/channels/search?q=${encodeURIComponent(searchQuery)}`,
//             success: function (channels) {
//                 channelList.empty();
//                 channels.forEach(function (channel) {
//                     const link = $('<a href="javascript:void(0);" data-id="' + channel._id + '">').text(channel.channelTitle);
//                     const listItem = $("<li>").append(link);
//                     channelList.append(listItem);
//                 });
//                 bindEventsToChannelItem();
//             },
//             error: function () {
//                 alert("Error searching channels.");
//             },
//         });
//     });

//     addChannelForm.submit(function (event) {
//         event.preventDefault();
//         let formData = {
//             channelTitle: $("#channelTitle").val(),
//             channelOwnerName: $("#channelOwnerName").val(),
//             channelDescription: $("#channelDescription").val(),
//             channelWebsite: $("#channelWebsite").val(),
//             keywords: $("#keywords").val(),
//             categories: $("#categories").val(),
//         };

//         $.ajax({
//             method: "POST",
//             url: "/channels",
//             data: formData,
//             success: function (response) {
//                 loadChannels();  // Reload channels list after adding a new channel
//                 $("#channelTitle").val("");
//                 $("#channelOwnerName").val("");
//                 $("#channelDescription").val("");
//                 $("#channelWebsite").val("");
//                 $("#keywords").val("");
//                 $("#categories").val("");
//             },
//             error: function (error) {
//                 alert("Error adding new channel");
//             },
//         });
//     });

//     addReviewForm.submit(function (event) {
//         event.preventDefault();
//         let formData = {
//             reviewTitle: $("#reviewTitle").val(),
//             reviewDescription: $("#reviewDescription").val(),
//             reviewRating: $("#reviewRating").val(),
//         };

//         let channelId = $("#channelId").val();  // Assuming you have an input with id channelId or a similar method to retrieve it
//         $.ajax({
//             method: "POST",
//             url: `/channels/${channelId}/reviews`,
//             data: formData,
//             success: function (response) {
//                 $("#reviewsList").append(
//                     `<li>
//                         <div class="reviewer-name">Reviewed by: ${response.reviewerName}</div>
//                         <div class="review-title"><strong>Title: ${response.title}</div>
//                         <div class="review-description">Description: ${response.description}</div>
//                         <div class="review-rating">Rating: ${response.rating}</div>
//                     </li>`
//                 );
//                 $("#reviewTitle").val("");
//                 $("#reviewDescription").val("");
//                 $("#reviewRating").val("");
//             },
//             error: function (error) {
//                 alert("Error adding new review");
//             },
//         });
//     });

//     loadChannels();
// })(window.jQuery);


(function ($) {
  let searchForm = $("#searchForm"),
      searchTermInput = $("#search_term"),
      channelList = $("#channelList"),
      addChannelForm = $("#addChannelForm"),
      addReviewForm = $("#addReviewForm");

  function bindEventsToChannelItem() {
      channelList.on("click", "a", function (event) {
          event.preventDefault();
          let channelId = $(this).data("id"); // Retrieve the channel ID stored in data-id attribute
          // Redirect to the individual channel page using the channel ID
          window.location.href = `http://localhost:3000/channels/${channelId}`;
      });
  }

  function loadChannels() {
      $.ajax({
          method: "GET",
          url: "/channels",
          success: function (channels) {
              channelList.empty(); // Clear previous entries
              channels.forEach(function (channel) {
                  // Create links with correct href attribute and data-id for each channel
                  const link = $('<a href="javascript:void(0);" data-id="' + channel._id + '">').text(channel.channelTitle);
                  const listItem = $("<li>").append(link);
                  channelList.append(listItem);
              });
              bindEventsToChannelItem(); // Bind click event handlers to the new links
          },
          error: function () {
              alert("Error fetching channels.");
          },
      });
  }

  searchForm.submit(function (event) {
      event.preventDefault();
      let searchQuery = $.trim(searchTermInput.val());
      if (!searchQuery) {
          alert("Please enter a valid search term.");
          return;
      }

      $.ajax({
          method: "GET",
          url: `/channels/search?q=${encodeURIComponent(searchQuery)}`,
          success: function (channels) {
              channelList.empty(); // Clear list before adding search results
              channels.forEach(function (channel) {
                  const link = $('<a href="javascript:void(0);" data-id="' + channel._id + '">').text(channel.channelTitle);
                  const listItem = $("<li>").append(link);
                  channelList.append(listItem);
              });
              bindEventsToChannelItem(); // Rebind click events to new links
          },
          error: function () {
              alert("Error searching channels.");
          },
      });
  });

  // Add channel form submission using the original functionality
  addChannelForm.submit(function (event) {
      event.preventDefault();
      let formData = {
          channelTitle: $("#channelTitle").val(),
          channelOwnerName: $("#channelOwnerName").val(),
          channelDescription: $("#channelDescription").val(),
          channelWebsite: $("#channelWebsite").val(),
          keywords: $("#keywords").val(),
          categories: $("#categories").val(),
      };

      $.ajax({
          method: "POST",
          url: "/channels",
          data: formData,
          success: function (response) {
              // Optionally alert the user or handle UI updates
              alert("Channel added successfully.");
              loadChannels(); // Reload channels to show the new addition
          },
          error: function (error) {
              alert("Error adding new channel");
          },
      });
  });

  loadChannels(); // Load channels on page load
})(window.jQuery);

