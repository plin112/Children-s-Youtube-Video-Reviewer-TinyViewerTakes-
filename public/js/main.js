document.addEventListener('DOMContentLoaded', () => {
    let registerationForm = document.getElementById('registration-form'); 
    let loginForm = document.getElementById('login-form');
  
    function displayErrorMsg(errors) {
        const errorMsg = document.getElementById('error-message');
        errorMsg.innerHTML = "";
  
        errors.forEach(error => {
            const list = document.createElement('li');
            list.textContent = error;
            errorMsg.appendChild(list);
        })
    }
    
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