// API KEX GOOGLE MAPS JAVASCRIPT :  AIzaSyC4ePiIwnNBHH2sOTJylXzNfiAlWt0w-IY
//const GOOGLE_MAPS_API_KEY = 'AIzaSyC4ePiIwnNBHH2sOTJylXzNfiAlWt0w-IY';

/*
const autocompleteService = new google.maps.places.AutocompleteService();

// Get references to the input field, suggestions div, and the "Add City" button
const cityInput = document.getElementById('cityInput');
const citySuggestions = document.getElementById('citySuggestions');
const addButton = document.getElementById('addButton');

// Store the selected city
let selectedCity = null;

// Attach an event listener for input changes
cityInput.addEventListener('input', function() {
  // Get the user's input
  const userInput = cityInput.value;

  // Clear the previous suggestions
  citySuggestions.innerHTML = '';

  // Call the Autocomplete Service to get suggestions
  if (userInput.length > 2) { // Optional: Require at least 3 characters for suggestions
    autocompleteService.getPlacePredictions(
      {
        input: userInput,
        types: ['(cities)'], // Limit suggestions to cities
      },
      function(predictions, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // Display the suggestions in a dropdown
          predictions.forEach(function(prediction) {
            const suggestionItem = document.createElement('div');
            suggestionItem.className = 'suggestion-item';
            suggestionItem.textContent = prediction.description;
            suggestionItem.addEventListener('click', function() {
              // Handle user selection from the dropdown
              selectedCity = prediction.description;
              cityInput.value = selectedCity;
              citySuggestions.innerHTML = '';

              // Enable the "Add City" button when a city is selected
              addButton.disabled = false;
            });
            citySuggestions.appendChild(suggestionItem);
          });
        }
      }
    );
  }
});

// Function to add a city to the list
function addCity() {
  if (selectedCity) {
    const cityList = document.getElementById('cityList');
    const newCityItem = document.createElement('li');
    newCityItem.className = 'city';
    newCityItem.textContent = selectedCity;

    // Create a delete button for the new city
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
      deleteCity(this);
    };

    // Append the city and delete button to the list
    newCityItem.appendChild(deleteButton);
    cityList.appendChild(newCityItem);

    // Add the city to the list
    cities.push(selectedCity);

    // Clear the input field and selected city
    cityInput.value = '';
    selectedCity = null;

    // Disable the "Add City" button after adding
    addButton.disabled = true;
  }
}

// ...

// Attach the addCity function to the button click event
addButton.addEventListener('click', addCity);







//AIzaSyC4ePiIwnNBHH2sOTJylXzNfiAlWt0w-IY
//var autocomplete = 'autocomplete'
/*function initMap(){
    var input = document.getElementById('searchInput');
    map.controls[google.maps.ControlPosition. ]
}*/
/*
let autocomplete;
function initializeAutocomplete(){
    autocomplete = new google.maps.places.Autocomplete(
    document.getElementById('autocomplete'),
    {
        types: ['establishment'],
        componentRestrictions: {'country' : ['AU']},
        fields: ['place_id', 'geometry', 'name']
    });

    autocomplete.addListener('place_changed' , onPlaceChanged);
}
function onPlaceChanged(){
    // GET WEATHER AND
    var place= autocomplete.getPlace();

    if(!place.geometry){
        document.getElementById('autocomplete').placeholder = 'Enter a city name';
    }else{
        document.getElementById('details').innerHTML = place.name;
    }
}

var service = new google.maps.places.AutocompleteService();
service.getPlacePredictions(
    displaySuggestions
)
*/


/*new google.maps.places.Autocomplete(document.getElementById('autocomplete'))
// Initialisieren Sie die Google Places Autocomplete-Funktion
function initializeAutocomplete() {
    const cityInput = document.getElementById('cityInput');
    const autocomplete = new google.maps.places.Autocomplete(cityInput);
  
    // Event-Handler für die Auswahl eines Orts aus der Autocomplete-Suche
    autocomplete.addListener('place_changed', function () {
      const selectedPlace = autocomplete.getPlace();
      // Hier können Sie den ausgewählten Ort verwenden, z.B. selectedPlace.name
    });
  }
  
  // Rufen Sie die initializeAutocomplete-Funktion auf, sobald die Seite geladen ist
  window.addEventListener('load', initializeAutocomplete);
  
  // Fügen Sie hier Ihren weiteren JavaScript-Code hinzu
  

  var ac = new google.maps.places.Autocomplete(document.getElementById('autocomplete')); 
  google.maps.event.addListener(ac, 'place_changed', function(){
    var place= ac.getPlace();
    console.log(place.formatted_address);
    console.log(place.url);
    console.log(place.geometry.location);
  })*/
  