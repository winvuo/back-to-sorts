import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// fetch databases from Supabase API and render activities sorted by category on webpage load
const supabaseUrl = "https://srfxftfqnjzhjapmpmlb.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const categoryContainer = document.querySelector(
  ".search-by-category-container"
);

async function loadCategories() {
  let { data: categories } = await supabase.from("categories").select("*");
  let { data: activities } = await supabase.from("activities").select("*");

  categories.forEach((data) => {
    const renderCategory = document.createElement("details");
    renderCategory.classList = "rendered-category-text";
    const summary = document.createElement("summary");
    summary.innerHTML = `${data.category_name}`;
    renderCategory.appendChild(summary);
    categoryContainer.appendChild(renderCategory);

    let dataID = data.id;

    activities.forEach((data) => {
      if (data.category === dataID) {
        let renderListItem = document.createElement("p");
        renderListItem.classList = "rendered-category-activity-text";
        renderListItem.innerHTML = data.activity;
        renderCategory.appendChild(renderListItem);

        renderListItem.addEventListener("click", addActivityToList);
      }
    });
  });
}

loadCategories();

// ----------> QUERY SELECTORS <----------

// QS: intro form
const nameInput = document.querySelector("#input-name");
const userName = document.querySelector("#user-name");
const nameInputSubmitButton = document.querySelector("#submit-name");
const cityInput = document.querySelector("#input-city");
const cityInputSubmitButton = document.querySelector("#submit-city");
const textOnFormSubmit = document.querySelector(".intro-form-description-end");

// QS: community lists
const communityWinnie = document.querySelector("#winnie");
const communityBrendan = document.querySelector("#brendan");

// QS: suggested activities
const suggestionsContainer = document.querySelector(".suggestions-container");

// QS: add by keyword
const keywordInput = document.querySelector("input.search-by-keyword");
const keywordSearchContainer = document.querySelector(
  ".keyword-search-container"
);
const keywordSearchButton = document.querySelector("button.search-by-keyword");
const keywordSearchClear = document.querySelector(".search-by-keyword-clear");

// QS: add own activity
const ownActivityInput = document.querySelector("input.add-my-own");
const ownActivitySubmitButton = document.querySelector("button.add-my-own");

// QS: Back To Sorts list content
const personalisedList = document.querySelector(".list-container");

// ----------> EVENT LISTENERS <----------

// EL: intro form
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") updateName();
});
nameInputSubmitButton.addEventListener("click", updateName);
cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") displayWeather();
});
cityInputSubmitButton.addEventListener("click", displayWeather);

// EL: community lists
communityWinnie.addEventListener("click", displayCommunityModal);
communityBrendan.addEventListener("click", displayCommunityModal);

// EL: add by keyword
keywordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchDatabase();
});
keywordSearchButton.addEventListener("click", searchDatabase);
keywordSearchClear.addEventListener("click", () => {
  keywordSearchContainer.innerHTML = "";
});

// EL: add own activity
ownActivitySubmitButton.addEventListener("click", () => {
  addActivityToListByUser();
  addNewActivityToDatabase();
  clearInput(ownActivityInput);
});
ownActivityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addActivityToListByUser();
    addNewActivityToDatabase();
    clearInput(ownActivityInput);
  }
});

// EL: Back To Sorts list content
personalisedList.addEventListener("click", deleteEntry);

// ----------> FUNCTIONS <----------

// F: clear input field
function clearInput(input) {
  input.value = "";
  input.placeholder = "type here";
}

// F: display and hide community list modal
function displayCommunityModal(e) {
  const modal = document.querySelector(`#modal-${e.target.id}`);
  const overlay = document.querySelector("#overlay");
  modal.style.display = "block";
  modal.style.zIndex = 10;
  overlay.style.opacity = 100;
  overlay.style.zIndex = 9;
  overlay.style.display = "block";

  overlay.addEventListener("click", function () {
    overlay.style.display = "none";
    modal.style.display = "none";
  });
}

// Global variables for "suggested activities" section
const weatherRelatedSuggestions = document.createElement("details");
weatherRelatedSuggestions.classList = "rendered-suggestions-text";
const weatherRelatedSuggestionsSummary = document.createElement("summary");
const renderWeather = document.createElement("p");
renderWeather.classList = "rendered-suggestions-weather";

// F: render weather information from 2 x API calls
function displayWeather() {
  const geolocationApiKey = process.env.geolocation_API_key;
  const weatherApiKey = process.env.weather_API_key;
  const geolocationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&appid=${geolocationApiKey}`;
  const weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall";

  cityInputSubmitButton.innerHTML = "submitted";

  // fetch latitude and longitude of the user's city
  fetch(geolocationUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      textOnFormSubmit.style.display = "block";
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      const cityName = data[0].name;

      // use geolocation data to fetch weather data from API and render on page
      fetch(
        `${weatherApiUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`
      )
        .then(function (response) {
          return response.json();
        })
        // render weather information
        .then(function (data) {
          const weatherIcon = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
          const img = document.createElement("img");
          img.classList = "weather-icon";
          img.src = weatherIcon;

          const weatherDescription = data.current.weather[0].description;
          const weatherFeelsLike = Math.round(data.current.feels_like);

          renderWeather.innerHTML = `Currently, the weather is ${weatherDescription} and feels like ${weatherFeelsLike}°C in ${cityName}.`;

          suggestionsContainer.appendChild(img);
          suggestionsContainer.appendChild(renderWeather);

          // render walk-related activities from the database as suggestions
          suggestWalk(weatherFeelsLike);
        });
    });
}

// F: API call to keyword search the database for "walk"
async function searchDatabaseForWalk() {
  const { data, error } = await supabase
    .from("activities")
    .select()
    .textSearch("activity", "walk");

  data.forEach((data) => {
    let renderSearchItem = document.createElement("p");
    renderSearchItem.classList = "rendered-walk-search-text";
    renderSearchItem.innerHTML = data.activity;
    weatherRelatedSuggestions.appendChild(renderSearchItem);

    renderSearchItem.addEventListener("click", addActivityToList);
  });
}

// F: render "walk" suggestions on the page based on weather
function suggestWalk(weatherFeelsLike) {
  if (renderWeather.innerHTML.includes("rain")) {
    weatherRelatedSuggestionsSummary.innerHTML = `Why not go for a walk? Remember to bring your brolly! Click here to see some 'walk' related suggestions.`;
  } else if (weatherFeelsLike <= 15) {
    weatherRelatedSuggestionsSummary.innerHTML = `Why not go for a walk? Remember to rug up! Click here to see some 'walk' related suggestions.`;
  } else if (weatherFeelsLike >= 25) {
    weatherRelatedSuggestionsSummary.innerHTML = `Why not go for a walk? Remember to stay hydrated! Click here to see some 'walk' related suggestions.`;
  } else {
    weatherRelatedSuggestionsSummary.innerHTML = `Why not go for a walk? Click here to see some 'walk' related suggestions.`;
  }

  weatherRelatedSuggestions.appendChild(weatherRelatedSuggestionsSummary);

  // fetch data from database to render suggestions related to "walk"
  searchDatabaseForWalk();

  suggestionsContainer.appendChild(weatherRelatedSuggestions);
}

// F: add activity selected by the user to the Back To Sorts list
function addActivityToList(e) {
  const newActivityArticle = document.createElement("article");
  newActivityArticle.classList.add("new-activity");
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.innerText = "x";
  newActivityArticle.appendChild(removeButton);
  const newActivity = document.createElement("li");
  newActivity.innerText = e.target.innerHTML;
  newActivityArticle.appendChild(newActivity);
  personalisedList.appendChild(newActivityArticle);
}

// F: add activity typed by user to the Back To Sorts list
function addActivityToListByUser() {
  const newActivityArticle = document.createElement("article");
  newActivityArticle.classList.add("new-activity");
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.innerText = "x";
  newActivityArticle.appendChild(removeButton);
  const newActivity = document.createElement("li");
  // value matches input by user
  newActivity.innerText = ownActivityInput.value;
  newActivityArticle.appendChild(newActivity);
  personalisedList.appendChild(newActivityArticle);
}

// F: add activity by keyword search from database
async function searchDatabase() {
  const { data, error } = await supabase
    .from("activities")
    .select()
    .textSearch("activity", `${keywordInput.value}`);

  clearInput(keywordInput);

  data.forEach((data) => {
    let renderSearchItem = document.createElement("li");
    renderSearchItem.classList = "rendered-keyword-search-text";
    renderSearchItem.innerHTML = data.activity;
    keywordSearchContainer.appendChild(renderSearchItem);
  });

  keywordSearchContainer.addEventListener("click", addActivityToList);
}

// F: add activity typed by user to the database
async function addNewActivityToDatabase() {
  const { data } = await supabase
    .from("activitiesNewInputs")
    .insert([{ newActivity: `${ownActivityInput.value}` }]);
}

// F: Back To Sorts list content - update user name on header based on input
function updateName() {
  let userNameInput = nameInput.value;
  let lastLetterInName = userNameInput.endsWith("s");
  if (lastLetterInName) {
    userName.innerHTML = `${userNameInput}'`;
  } else {
    userName.innerHTML = `${userNameInput}'s`;
  }
  nameInputSubmitButton.innerHTML = "submitted";
}

// F: Back To Sorts list content - delete an entry from the list
function deleteEntry(e) {
  const item = e.target;
  if (item.classList[0] === "remove-button") {
    const entry = item.parentElement;
    entry.remove();
  }
}
