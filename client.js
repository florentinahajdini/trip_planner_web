// Get the button element by its ID
const loginButton = document.getElementById('loginButton');

// Add a click event listener to the button
loginButton.addEventListener('click', function () {
    // Redirect to the login page (change the URL)
    window.location.href = 'login.html'; // Replace with the actual URL of the login page
});
// client.js
const homeLink = document.getElementById('home-link');

homeLink.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default behavior of the link
  window.location.href = '/files/index.html'; // Redirect to index.html
});
