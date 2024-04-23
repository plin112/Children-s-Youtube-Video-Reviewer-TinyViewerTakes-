// This file does client side validation and carries out ajax calls

// console.log("main.js loaded");

// (function ($) {
//     let searchForm = $('#searchForm'),
//         searchTermInput = $('#search_term'),
//         channelList = $('#channelList'),
//         channelDetails = $('#channelDetails');

//     function bindEventsToChannelItem(channelLink) {
//         channelLink.on('click', function (event) {
//             event.preventDefault();
//             let channelId = $(this).data('id');

//             $.ajax({
//                 method: 'GET',
//                 url: `/channels/${channelId}`,
//                 success: function (channel) {
//                     channelList.hide();
//                     channelDetails.empty();

//                     const name = $('<h1>').text(channel.channelTitle);
//                     const description = $('<p>').text(channel.channelDescription);
//                     const details = $('<dl>');
//                     // You can add more details similarly
//                     details.append($('<dt>').text('Owner'), $('<dd>').text(channel.channelOwnerName));

//                     channelDetails.append(name, description, details);
//                     channelDetails.show();
//                 },
//                 error: function () {
//                     alert('Error loading channel details.');
//                 }
//             });
//         });
//     }

//     function loadChannels() {
//         $.ajax({
//             method: 'GET',
//             url: '/channels',
//             success: function (channels) {
//                 channelList.empty().show();
//                 channelDetails.hide();
//                 channels.forEach(function (channel) {
//                     const link = $('<a href="#">')
//                                  .text(channel.channelTitle)
//                                  .data('id', channel._id);
//                     const listItem = $('<li>').append(link);
//                     channelList.append(listItem);
//                     bindEventsToChannelItem(link);

//                 });
//             },
//             error: function () {
//                 alert('Error fetching channels.');
//             }
//         });
//     }

//     searchForm.submit(function (event) {
//         event.preventDefault();
//         let searchQuery = $.trim(searchTermInput.val());
//         if (!searchQuery) {
//             alert('Please enter a valid search term.');
//             return;
//         }

//         $.ajax({
//             method: 'GET',
//             url: `/channels/search?q=${encodeURIComponent(searchQuery)}`,
//             success: function (results) {
//                 channelList.empty();
//                 results.forEach(function (channel) {
//                     const link = $('<a href="#">').text(channel.channelTitle).data('id', channel._id);
//                     const listItem = $('<li>').append(link);
//                     channelList.append(listItem);
//                     bindEventsToChannelItem(link);
//                 });
//                 channelList.show();
//                 channelDetails.hide();
//             },
//             error: function () {
//                 alert('Error searching channels.');
//             }
//         });
//     });

//     loadChannels();
// })(window.jQuery);
// console.log("main.js loaded");

// (function ($) {
//     let searchForm = $('#searchForm'),
//         searchTermInput = $('#search_term'),
//         channelList = $('#channelList'),
//         channelDetails = $('#channelDetails');

//     function bindEventsToChannelItem() {
//         channelList.on('click', 'a', function (event) {
//             event.preventDefault();
//             let channelId = $(this).data('id');

//             $.ajax({
//                 method: 'GET',
//                 url: `/channels/${channelId}`,
//                 success: function (html) {
//                     channelList.hide();
//                     channelDetails.html(html).show(); // Assumes server sends back full HTML for the channel details
//                 },
//                 error: function () {
//                     alert('Error loading channel details.');
//                 }
//             });
//         });
//     }

//     function loadChannels() {
//         $.ajax({
//             method: 'GET',
//             url: '/channels',
//             success: function (html) {
//                 channelList.html(html).show(); // Assumes server sends back full HTML list of channels
//                 channelDetails.hide();
//                 bindEventsToChannelItem(); // Bind events after HTML has been inserted
//             },
//             error: function () {
//                 alert('Error fetching channels.');
//             }
//         });
//     }

//     searchForm.submit(function (event) {
//         event.preventDefault();
//         let searchQuery = $.trim(searchTermInput.val());
//         if (!searchQuery) {
//             alert('Please enter a valid search term.');
//             return;
//         }

//         $.ajax({
//             method: 'GET',
//             url: `/channels/search?q=${encodeURIComponent(searchQuery)}`,
//             success: function (html) {
//                 channelList.html(html).show(); // Assumes server sends back full HTML list of search results
//                 channelDetails.hide();
//                 bindEventsToChannelItem(); // Rebind event handlers to new links
//             },
//             error: function () {
//                 alert('Error searching channels.');
//             }
//         });
//     });

//     loadChannels();
// })(window.jQuery);
(function ($) {
  let searchForm = $("#searchForm"),
    searchTermInput = $("#search_term"),
    channelList = $("#channelList");
  addChannelForm = $("#addChannelForm");
  addReviewForm = $("#addReviewForm");

  function bindEventsToChannelItem() {
    // Use event delegation to handle clicks on dynamically created links
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
          const link = $(
            '<a href="javascript:void(0);" data-id="' + channel._id + '">'
          ).text(channel.channelTitle);
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
          const link = $(
            '<a href="javascript:void(0);" data-id="' + channel._id + '">'
          ).text(channel.channelTitle);
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

  // Add channel form
  addChannelForm.submit(function (event) {
    event.preventDefault();
    let formData = {
      channelTitle: $("#channelTitle").val(),
      channelOwnerName: $("#channelOwnerName").val(),
      channelDescription: $("#channelDescription").val(),
      channelWebsite: $("#channelWebsite").val(),
      keywords: $("#keywords").val().split(","),
      categories: $("#categories").val().split(","),
    };

    $.ajax({
      method: "POST",
      url: "/channels",
      data: formData,

      success: function (response) {
        // Clear the form fields after successful addition
        $("#channelTitle").val("");
        $("#channelOwnerName").val("");
        $("#channelDescription").val("");
        $("#channelWebsite").val("");
        $("#keywords").val("");
        $("#categories").val("");
      },
      error: function (error) {
        alert("Error adding new channel");
      },
    });
  });

  // Add review form

  let addReviewForm = $("#addReviewForm");

  addReviewForm.submit(function (event) {
    console.log("before formdata or url");
    event.preventDefault();
    let formData = {
      reviewTitle: $("#reviewTitle").val(),
      reviewDescription: $("#reviewDescription").val(),
      reviewRating: $("#reviewRating").val(),
    };

    let testurl = `/channels/${channelId}/reviews`;
    console.log(testurl);
    $.ajax({
      method: "POST",
      url: `/channels/${channelId}/reviews`,
      // data: JSON.stringify(formData),

      success: function (response) {

         // Append the new review to the reviews list
        $('#reviewsList').append(
          `<li>
            <div class="reviewer-name">Reviewed by: ${response.reviewerName}</div>
            <div class="review-title"><strong>Title: ${response.title}</div>
            <div class="review-description">Description: ${response.description}</div>
            <div class="review-rating">Rating: ${response.rating}</div>
          </li>`
        );

        // Clear the form fields after successful addition
        $("#reviewTitle").val("");
        $("#reviewDescription").val("");
        $("#reviewRating").val("");
      },
      error: function (error) {
        alert("Error adding new review");
      },
    });
  });

  // Handle comment form submission using AJAX
  $(document).on('submit', '.comment-form', function(event) {
    event.preventDefault();
    const $form = $(this);
    const commentText = $form.find('input[name="comment"]').val().trim(); // Assuming input name is 'comment'
    if (commentText === "") {
        alert("Please enter a comment before submitting.");
        return; // Prevent form submission
    }
    const data = $form.serialize();  // Use jQuery to serialize form data
    $.ajax({
      method: 'POST',
      url: $form.attr('action'),  // Use form's action attribute
      data: data,
      success: function (response) {
        if (response.success) {
          const commentList = $form.prev('.review-comments').find('ul');
          const newComment = $('<li>').text(`${response.commenterName}: ${response.comment}`);
          commentList.append(newComment);
          $form[0].reset(); // Reset the form fields
          $form.hide(); // Optionally hide the form
          $form.siblings('.btn-show-comment-form').show(); // Show the add comment button again
          showToast("Comment added successfully!");
        } else {
          alert('Failed to add comment');
        }
      },
      error: function () {
        alert('Error submitting comment');
      }
    });
  });

  // Optionally handle showing/hiding the comment form
  $(document).on('click', '.btn-show-comment-form', function() {
    const $button = $(this).closest('.comment-form');
    $button.next('.comment-form').show();  // Show the form
    $button.hide();  // Hide the add comment button
  });


  loadChannels();
})(window.jQuery);
