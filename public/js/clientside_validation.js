$(document).ready(function () {
  let searchForm = $("#searchForm"),
    searchTermInput = $("#search_term"),
    searchKeywordInput = $("#search_keyword"),
    channelList = $("#channelList"),
    addChannelForm = $("#addChannelForm"),
    addReviewForm = $("#addReviewForm");

  // Add channel form submission
  $("#addChannelForm").submit(function (event) {
    event.preventDefault();
    if (validateAddChannelForm()) {
      const formData = {
        channelTitle: $("#channelTitle").val(),
        channelOwnerName: $("#channelOwnerName").val(),
        channelDescription: $("#channelDescription").val(),
        channelWebsite: $("#channelWebsite").val(),
        keywords: $("#keywords")
          .val()
          .split(",")
          .map((kw) => kw.trim()),
        categories: $("#categories")
          .val()
          .split(",")
          .map((cat) => cat.trim()),
        startingAge: parseInt($("#startingAge").val(), 10),
      };

      $.ajax({
        url: "/channels",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
          alert("Channel added successfully.");
          // Optionally reload the list or clear the form
          window.location.href = "/channels";
        },
        error: function () {
          alert("Error adding channel.");
        },
      });
    } else {
      alert("Please fill all required fields correctly.");
    }
  });

  // Search form submission
  $("#searchForm").submit(function (event) {
    event.preventDefault();
    let searchQuery = searchTermInput.val(); // Corrected to use the appropriate selector
    if (!searchQuery || searchQuery.trim() === "") {
      $.ajax({
        method: "GET",
        url: "/channels/search",
        success: function () {
          // Success callback: reload the page
          window.location.reload();
        },
        error: function () {
          // Error callback: handle error, such as displaying an alert
          alert("Your search input must not be empty or made of just spaces");
        },
      });
      return;
    }

    $.ajax({
      method: "GET",
      url: `/channels/search?search_term=${encodeURIComponent(searchQuery)}`,
      dataType: "json", // This ensures jQuery expects a JSON response
      success: function (data) {
        channelList.empty(); // Clear the list before adding search results
        if (data && data.length > 0) {
          data.forEach(function (channel) {
            const link = $(
              '<a href="javascript:void(0);" data-id="' + channel._id + '">'
            ).text(channel.channelTitle);
            const listItem = $("<li>").append(link);
            channelList.append(listItem);
          });
          bindEventsToChannelItem(); // Rebind click events to new links
        } else {
          channelList.append($("<li>").text("No channels found."));
        }
      },
      error: function () {
        alert("Error searching channels.");
      },
    });
  });

  //search by keyword
  $("#searchKeywordForm").submit(function (event) {
    event.preventDefault();
    let searchQuery = searchKeywordInput.val(); // Corrected to use the appropriate selector
    if (!searchQuery || searchQuery.trim() === "") {
      alert("Please enter a keyword to search.");
    }

    $.ajax({
      method: "GET",
      url: `/channels/searchKeyword?search_keywords=${encodeURIComponent(
        searchQuery
      )}`,
      dataType: "json",
      success: function (data) {
        channelList.empty();
        if (data && data.length > 0) {
          data.forEach(function (channel) {
            const link = $(
              '<a href="javascript:void(0);" data-id="' + channel._id + '">'
            ).text(channel.channelTitle);
            const listItem = $("<li>").append(link);
            channelList.append(listItem);
          });
          bindEventsToChannelItem(); // Rebind click events to new links
        } else {
          channelList.append($("<li>").text("No channels found."));
        }
      },
      error: function () {
        alert("Error searching channels by keyword.");
      },
    });
  });

  // Add review form submission
  $("#addReviewForm").submit(function (event) {
    event.preventDefault();
    const reviewText = $("#reviewText").val().trim();
    if (reviewText) {
      // Assume channel ID is available or extracted from the DOM
      const channelId = getCurrentChannelId();
      $.ajax({
        url: `/channels/${channelId}/reviews`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ reviewText }),
        success: function () {
          alert("Review submitted successfully.");
          // Optionally reload reviews
        },
        error: function () {
          alert("Error submitting review.");
        },
      });
    } else {
      alert("Review cannot be empty.");
    }
  });

  function validateAddChannelForm() {
    // Implement validation logic; return true if valid, false otherwise
    // Check if inputs are not empty and match any specific patterns (like URL)
    return $("#addChannelForm")[0].checkValidity();
  }

  function getCurrentChannelId() {
    // Extract and return the current channel ID based on your application logic or DOM structure
    return "channelId"; // Placeholder
  }

  function bindEventsToChannelItem() {
    channelList.on("click", "a", function (event) {
      event.preventDefault();
      let channelId = $(this).data("id"); // Retrieve the channel ID stored in data-id attribute
      // Redirect to the individual channel page using the channel ID
      window.location.href = `http://localhost:3000/channels/${channelId}`;
    });
  }
});

async function removeReview(id) {
  $.ajax({
    url: `/review/${id}`,
    method: "DELETE",
    success: function () {
      $(`#review-${id}`).remove();
    },
    error: function () {
      alert("Error removing review.");
    },
  });
  return;
}
