$(document).ready(function () {
  let searchForm = $("#searchForm"),
    searchTermInput = $("#search_term"),
    searchKeywordInput = $("#search_keyword"),
    channelList = $("#channelList"),
    addChannelForm = $("#addChannelForm"),
    addReviewForm = $("#addReviewForm");

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
        error: function (xhr) {
          console.log("Error received:", xhr.responseText);
          let errorMessage = "An unknown error occurred.";

          if (xhr.status === 401) {
            errorMessage = "You are not login/unauthorized"
            window.location.href = "/login";  // Redirect to the login page
          }
          if (xhr.responseText) {
            errorMessage = xhr.responseText;
          }
          $('#errorDisplay').text(errorMessage).show();
        }
      });
    } else {
      $('#errorDisplay').text("Please fill all required fields correctly.");
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

    if (!reviewText){
      displayError('Input cannot be empty or just spaces!');
    }
    //if (reviewText) {
      // Assume channel ID is available or extracted from the DOM
      //const channelId = getCurrentChannelId();
    //   $.ajax({
    //     url: `/channels/${channelId}`,
    //     method: "POST",
    //     contentType: "application/json",
    //     data: JSON.stringify({ reviewText }),
    //     success: function () {
    //       alert("Review submitted successfully.");
    //       window.location.href = `/channels/${channelId}`;
    //     },
    //     error: function (xhr) {
    //       //console.log("Error received:", xhr.responseText);
    //       console.log("Error received:");
    //       /*let errorMessage = xhr.responseText || "An unknown error occurred.";

    //       if (xhr.status === 401) {
    //         errorMessage = "You are not login/unauthorized";
    //         alert(errorMessage);
    //         window.location.href = "/login";  // Redirect to the login page
    //       }
    //       else if (xhr.status === 400) {
    //         window.location.href = `/channels/${channelId}`;
    //         errorMessage = xhr.responseText;
    //         alert(errorMessage);
    //         $('#addReviewError').text(errorMessage).show();
    //       } 
    //       else {
    //         window.location.href = `/channels/${channelId}`;
    //         alert(errorMessage);
    //         $('#addReviewError').text(errorMessage).show();
    //       }*/
          
    //     }
    //   });
    // } else {
    //   alert("Review cannot be empty.");
    // }


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
      /*alert("Review removed successfully! Moving to main page.");
      window.location.href = `/channels`;*/
      alert("Review removed successfully!");
      //const currentChannelId = getCurrentChannelId();  // Get the current channel ID
      //window.location.href = `/channels/${currentChannelId}`; 
      window.location.reload();
    },
    error: function (xhr) {
          console.log("Error received:", xhr.responseText);
          let errorMessage = "An unknown error occurred.";
          
          if (xhr.status === 401) {
            errorMessage = "You are not login/unauthorized";
            alert(errorMessage);
            window.location.href = "/login";  // Redirect to the login page
          }
          if (xhr.status === 400) {
            errorMessage = xhr.responseText;
            alert(errorMessage);
          }
          $('#reviewError').text(errorMessage).show();
        }
  });
  return;
}

function displayErrorMsg(errors) {
  const errorMsg = document.getElementById('errorMessages');
  
  errors.forEach(error => {
    const errorElement = document.createElement("p");
    errorElement.textContent = error;
    errorContainer.appendChild(errorElement);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  let registerationForm = document.getElementById('registration-form'); 
  let loginForm = document.getElementById('login-form');

  if (registerationForm) {
      registerationForm.addEventListener('submit', (event) =>{
          event.preventDefault();

          let firstName = document.getElementById('firstNameInput').value;
          let lastName = document.getElementById('lastNameInput').value;
          let emailAddress = document.getElementById('emailAddressInput').value;
          let password = document.getElementById('passwordInput').value;
          let confirmPassword = document.getElementById('confirmPasswordInput').value;

          //error handling
          let errorMsg = [];

          if (!firstName ||
              !lastName ||
              !emailAddress ||
              !password ||
              !confirmPassword
          ) {
              errorMsg.push("All fields need to be supplied");
          } 

          // validations for input
          firstName = firstName.trim();
          lastName = lastName.trim();
          emailAddress = emailAddress.trim();
          password = password.trim();
          confirmPassword = confirmPassword.trim();

          if (typeof firstName !== 'string' || typeof lastName !== 'string') {
              errorMsg.push('Name need to be in string')
          }

          if (password !== confirmPassword) {
              errorMsg.push('Password does not match');
          }

          const pattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
          emailAddress = emailAddress.toLowerCase();
          if (typeof emailAddress !== "string" || !pattern.test(emailAddress)) {
              errorMsg.push('Email address is invalid.');
          }

          if (errorMsg.length > 0) {
              displayErrorMsg(errorMsg);
          }
          else {
              registerationForm.submit();
          }
  })}

  if (loginForm) {
      loginForm.addEventListener('submit', (event) =>{
          event.preventDefault();

          let emailAddress = document.getElementById('emailAddressInput').value;
          let password = document.getElementById('passwordInput').value;

          //error handling
          let errorMsg = [];

          if (!emailAddress || !password) {
              errorMsg.push("All fields need to be supplied");
          } 

          // validations for input
          //email validation
          if (typeof emailAddress !== 'string') {
              errorMsg.push("Email address need to be in string.");
          }
          emailAddress = emailAddress.trim();
          if(emailAddress.length === 0){
              errorMsg.push("Email address cannot be empty string or string with just spaces.")
          }
          const pattern = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
          emailAddress = emailAddress.toLowerCase();
          if (!pattern.test(emailAddress)) {
              errorMsg.push('Email address is invalid.');
          }

          //password validation
          if (typeof password !== 'string') {
              errorMsg.push("Email address need to be in string.");
          }
          password = password.trim();
          if(password.length === 0){
              errorMsg.push("Email address cannot be empty string or string with just spaces.")
          }

          if (errorMsg.length > 0) {
              displayErrorMsg(errorMsg);
          }
          else {
              loginForm.submit();
          }
  })}
})