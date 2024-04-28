$(document).ready(function () {
  let searchForm = $("#searchForm"),
    searchTermInput = $("#search_term"),
    searchKeywordInput = $("#search_keyword"),
    channelList = $("#channelList"),
    addChannelForm = $("#addChannelForm"),
    addReviewForm = $("#addReviewForm");

  $("#addChannelForm").submit(function (event) {
    event.preventDefault();

    let errorMessages = [];
    let isValid = true;
    const formData = {
      channelTitle: $("#channelTitle").val().trim(),
      channelOwnerName: $("#channelOwnerName").val().trim(),
      channelDescription: $("#channelDescription").val().trim(),
      channelWebsite: $("#channelWebsite").val().trim(),
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

    if (!channelTitle) {
      errorMessages.push("Channel title cannot be empty.");
      isValid = false;
    }

    // Validate Review Description
    if (!channelOwnerName) {
      errorMessages.push("Channel owner name cannot be empty.");
      isValid = false;
    }

    if (!channelDescription) {
      errorMessages.push("Channel description cannot be empty.");
      isValid = false;
    }

    if (parseFloat(startingAge) || startingAge <= 0) {
      errorMessages.push("Parental guidance age must be a number greater than 0.");
      isValid = false;
    }

    // Display errors or submit the form
    if (!isValid) {
        displayChannelErrorMsg(errorMessages);
    } else {
      // If all validations pass, submit the form programmatically
      $.ajax({
        url: "/channels",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function () {
          alert("Channel added successfully.");
          window.location.href = "/channels";
        },
        error: function (xhr) {
          let errorMessage = xhr.responseText || "An unknown error occurred.";
          if (xhr.status === 401) {
            errorMessage = "You are not logged in/unauthorized.";
            window.location.href = "/login";
          }
          $("#errorDisplay").text(errorMessage).show();
        },
      });
    }

  });

  searchForm.submit(function (event) {
    event.preventDefault();
    let searchQuery = searchTermInput.val();
    if (!searchQuery.trim()) {
      alert("Your search input must not be empty or made of just spaces");
      return;
    }

    $.ajax({
      method: "GET",
      url: `/channels/search?search_term=${encodeURIComponent(searchQuery)}`,
      dataType: "json",
      success: function (data) {
        channelList.empty();
        if (data.length > 0) {
          data.forEach(function (channel) {
            const link = $(
              '<a href="javascript:void(0);" data-id="' + channel._id + '">'
            ).text(channel.channelTitle);
            const listItem = $("<li>").append(link);
            channelList.append(listItem);
          });
          bindEventsToChannelItem();
        } else {
          channelList.append($("<li>").text("No channels found."));
        }
      },
      error: function () {
        alert("Error searching channels.");
      },
    });
  });

  $("#searchKeywordForm").submit(function (event) {
    event.preventDefault();
    let searchQuery = searchKeywordInput.val();
    if (!searchQuery.trim()) {
      alert("Please enter a keyword to search.");
      return;
    }

    $.ajax({
      method: "GET",
      url: `/channels/searchKeyword?search_keywords=${encodeURIComponent(
        searchQuery
      )}`,
      dataType: "json",
      success: function (data) {
        channelList.empty();
        if (data.length > 0) {
          data.forEach(function (channel) {
            const link = $(
              '<a href="javascript:void(0);" data-id="' + channel._id + '">'
            ).text(channel.channelTitle);
            const listItem = $("<li>").append(link);
            channelList.append(listItem);
          });
          bindEventsToChannelItem();
        } else {
          channelList.append($("<li>").text("No channels found."));
        }
      },
      error: function () {
        alert("Error searching channels by keyword.");
      },
    });
  });

  $("#addReviewForm").submit(function (event) {
    event.preventDefault(); // Prevent the default form submission

    let errorMessages = [];
    const reviewTitle = $("#reviewTitle").val().trim();
    const reviewDescription = $("#reviewDescription").val().trim();
    const reviewRating = parseFloat($("#reviewRating").val().trim());
    let isValid = true;

    // Validate Review Title
    if (!reviewTitle) {
      errorMessages.push("Review title cannot be empty.");
      isValid = false;
    }

    // Validate Review Description
    if (!reviewDescription) {
      errorMessages.push("Review description cannot be empty.");
      isValid = false;
    }

    // Validate Review Rating
    if (isNaN(reviewRating) || reviewRating < 1 || reviewRating > 5) {
      errorMessages.push("Rating must be a number between 1 and 5.");
      isValid = false;
    }

    // Display errors or submit the form
    if (!isValid) {
      displayReviewErrorMsg(errorMessages);
    } else {
      // If all validations pass, submit the form programmatically
      this.submit();
    }
  });

  function displayReviewErrorMsg(errors) {
    //add channel error display
    const addReviewErrorMsg = $("#addReviewError");
    addReviewErrorMsg.empty();

    errors.forEach((error) => {
      const list = $("<li>").text(error);
      addReviewErrorMsg.append(list);
      addChannelErrorMsg.append(list);
    });
  }

  function displayChannelErrorMsg(errors) {
    const addChannelErrorMsg = $("#errorDisplay");
    addChannelErrorMsg.empty();
    errors.forEach((error) => {
        const list = $("<li>").text(error);
        addChannelErrorMsg.append(list);
      });
  }

  function bindEventsToChannelItem() {
    channelList.on("click", "a", function (event) {
      event.preventDefault();
      let channelId = $(this).data("id");
      window.location.href = `/channels/${channelId}`;
    });
  }

  displayReviewErrorMsg;
  displayChannelErrorMsg
});

async function removeReview(id) {
  $.ajax({
    url: `/review/${id}`,
    method: "DELETE",
    success: function () {
      alert("Review removed successfully!");
      window.location.reload();
    },
    error: function (xhr) {
      console.log("Error received:", xhr.responseText);
      let errorMessage = "An unknown error occurred.";

      if (xhr.status === 401) {
        errorMessage = "You are not logged in/unauthorized.";
        alert(errorMessage);
        window.location.href = "/login";
      } else if (xhr.status === 400) {
        errorMessage = xhr.responseText;
        alert(errorMessage);
      }
      $("#reviewError").text(errorMessage).show();
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  let registerationForm = document.getElementById("registration-form");
  let loginForm = document.getElementById("login-form");

  function displayErrorMsg(errors) {
    const errorMsg = document.getElementById("error-message");
    errorMsg.innerHTML = "";

    errors.forEach((error) => {
      const list = document.createElement("li");
      list.textContent = error;
      errorMsg.appendChild(list);
    });
  }

  if (registerationForm) {
    registerationForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let firstName = document.getElementById("firstNameInput").value.trim();
      let lastName = document.getElementById("lastNameInput").value.trim();
      let emailAddress = document
        .getElementById("emailAddressInput")
        .value.trim()
        .toLowerCase();
      let password = document.getElementById("passwordInput").value.trim();
      let confirmPassword = document
        .getElementById("confirmPasswordInput")
        .value.trim();

      //error handling
      let errorMsg = [];

      if (
        !firstName ||
        !lastName ||
        !emailAddress ||
        !password ||
        !confirmPassword
      ) {
        errorMsg.push("All fields need to be supplied");
      }

      if (typeof firstName !== "string" || typeof lastName !== "string") {
        errorMsg.push("Name need to be in string");
      }

      if (password !== confirmPassword) {
        errorMsg.push("Password does not match");
      }

      const pattern =
        /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      emailAddress = emailAddress.toLowerCase();
      if (typeof emailAddress !== "string" || !pattern.test(emailAddress)) {
        errorMsg.push("Email address is invalid.");
      }

      //console.log("error message received", errorMsg.length);
      if (errorMsg.length > 0) {
        displayErrorMsg(errorMsg);
      } else {
        registerationForm.submit();
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      let emailAddress = document.getElementById("emailAddressInput").value;
      let password = document.getElementById("passwordInput").value;

      //error handling
      let errorMsg = [];

      if (!emailAddress || !password) {
        errorMsg.push("All fields need to be supplied");
      }

      // validations for input
      //email validation
      if (typeof emailAddress !== "string") {
        errorMsg.push("Email address need to be in string.");
      }
      emailAddress = emailAddress.trim();
      if (emailAddress.length === 0) {
        errorMsg.push(
          "Email address cannot be empty string or string with just spaces."
        );
      }
      const pattern =
        /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
      emailAddress = emailAddress.toLowerCase();
      if (!pattern.test(emailAddress)) {
        errorMsg.push("Email address is invalid.");
      }

      //password validation
      if (typeof password !== "string") {
        errorMsg.push("Email address need to be in string.");
      }
      password = password.trim();
      if (!password) {
        errorMsg.push(
          "Email address cannot be empty string or string with just spaces."
        );
      }

      if (errorMsg.length > 0) {
        displayErrorMsg(errorMsg);
      } else {
        loginForm.submit();
      }
    });
  }

  displayErrorMsg;
});
