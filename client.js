// Get the button element by its ID
const loginButton = document.getElementById('loginButton');

// Add a click event listener to the button
loginButton.addEventListener('click', function () {
    // Redirect to the login page (change the URL)
    window.location.href = 'login.html'; // Replace with the actual URL of the login page
});


// ADD CITY BUTTON
/*function addCity() {
  const cityInput = document.getElementById('cityInput');
  const cityName = cityInput.value.trim();

  console.log('addCity function called');

  if (cityName) {
    // Create a new trip object
    const trip = { name: cityName };

    // Send a POST request to create the trip
    fetch('/api/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trip),
    })
      .then(response => response.json())
      .then(data => {
        
        console.log(data);

        addToTripList(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });

    // Clear the input field
    cityInput.value = '';
  }
}

// Function to delete a city from the list
function deleteCity(deleteButton) {
  const listItem = deleteButton.parentElement;
  const tripId = listItem.getAttribute('data-trip-id'); // Get the trip ID from the data attribute

  // Send a DELETE request to remove the trip by ID
  fetch(`/api/trips/${tripId}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      // Assuming the server responds with a success message
      // You can update your UI or perform any necessary actions
      console.log(data);

      // Remove the trip item from the list
      const cityList = document.getElementById('cityList');
      cityList.removeChild(listItem);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Attach the addCity function to the "Add Trip" button click event
const addButton = document.getElementById('addButton');
addButton.addEventListener('click', addCity);

// Attach the deleteCity function to the "Delete" buttons
const deleteButtons = document.querySelectorAll('.delete-button');
deleteButtons.forEach(button => {
  button.addEventListener('click', function () {
    deleteCity(this);
  });
});
*/