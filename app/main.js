import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// fetch databases from Supabase API and render on webpage load
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

        renderListItem.addEventListener("click", addToPlanByCategory);
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
  if (e.key === "Enter") {
    displayWeather();
  }
});
cityInputSubmitButton.addEventListener("click", displayWeather);

// EL: community lists
communityWinnie.addEventListener("click", displayCommunityModal);
communityBrendan.addEventListener("click", displayCommunityModal);

// EL: add by keyword
keywordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchDatabase();
  }
});
keywordSearchButton.addEventListener("click", searchDatabase);
keywordSearchClear.addEventListener("click", clearSearchResults);

// EL: add own activity
ownActivitySubmitButton.addEventListener("click", addToPlanByOwnActivity);
ownActivityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addToPlanByOwnActivity();
});

// EL: Back To Sorts list content
personalisedList.addEventListener("click", deleteEntry);

// ----------> FUNCTIONS <----------

function clearInput(input) {
  input.value = "";
  input.placeholder = "type here";
}

// F: community lists
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

// F: suggested activities
function displayWeather() {
  const geolocationApiKey = process.env.geolocation_API_key;
  const weatherApiKey = process.env.weather_API_key;
  cityInputSubmitButton.innerHTML = "submitted";
  const geolocationUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput.value}&appid=${geolocationApiKey}`;
  const weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall";

  fetch(geolocationUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      textOnFormSubmit.style.display = "block";
      const latitude = data[0].lat;
      const longitude = data[0].lon;
      const cityName = data[0].name;
      fetch(
        `${weatherApiUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${weatherApiKey}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          const weatherIcon = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
          const img = document.createElement("img");
          img.classList = "weather-icon";
          img.src = weatherIcon;

          const weatherDescription = data.current.weather[0].description;
          const weatherFeelsLike = Math.round(data.current.feels_like);
          const renderWeather = document.createElement("p");
          renderWeather.classList = "rendered-suggestions-weather";
          renderWeather.innerHTML = `Currently, the weather is ${weatherDescription} and feels like ${weatherFeelsLike}°C in ${cityName}.`;

          const weatherRelatedSuggestions = document.createElement("details");
          weatherRelatedSuggestions.classList = "rendered-suggestions-text";
          const weatherRelatedSuggestionsSummary =
            document.createElement("summary");

          if (weatherDescription.includes("rain")) {
            weatherRelatedSuggestionsSummary.innerHTML = `Why not go for a walk? Remember to bring your brolly! Click here to see some 'walk' related suggestions.`;
          } else if (weatherFeelsLike <= 15) {
            weatherRelatedSuggestionsSummary.innerHTML = `Why not go for a walk? Remember to rug up! Click here to see some 'walk' related suggestions.`;
          } else if (weatherFeelsLike >= 25) {
            weatherRelatedSuggestionsSummary.innerHTML = `Why not go for a walk? Remember to stay hydrated! Click here to see some 'walk' related suggestions.`;
          } else {
            weatherRelatedSuggestionsSummary.innerHTML = `Why not go for a walk? Click here to see some 'walk' related suggestions.`;
          }

          weatherRelatedSuggestions.appendChild(
            weatherRelatedSuggestionsSummary
          );

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

              renderSearchItem.addEventListener("click", addToPlanByCategory);
            });
          }
          searchDatabaseForWalk();

          suggestionsContainer.appendChild(img);
          suggestionsContainer.appendChild(renderWeather);
          suggestionsContainer.appendChild(weatherRelatedSuggestions);
        });
    });
}

// F: add by category
function addToPlanByCategory(e) {
  const newActivityDiv = document.createElement("div");
  newActivityDiv.classList.add("new-activity");
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.innerText = "x";
  newActivityDiv.appendChild(removeButton);
  const newActivity = document.createElement("li");
  newActivity.innerText = e.target.innerHTML;
  newActivityDiv.appendChild(newActivity);
  personalisedList.appendChild(newActivityDiv);
}

// F: add by keyword
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

  keywordSearchContainer.addEventListener("click", addToPlanByKeywordSearch);
}

function addToPlanByKeywordSearch(e) {
  const newActivityDiv = document.createElement("div");
  newActivityDiv.classList.add("new-activity");
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.innerText = "x";
  newActivityDiv.appendChild(removeButton);
  const newActivity = document.createElement("li");
  newActivity.innerText = e.target.innerHTML;
  newActivityDiv.appendChild(newActivity);
  personalisedList.appendChild(newActivityDiv);
}

function clearSearchResults() {
  keywordSearchContainer.innerHTML = "";
}

// F: add own activity
async function addNewActivityToDatabase() {
  const { data } = await supabase
    .from("activitiesNewInputs")
    .insert([{ newActivity: `${ownActivityInput.value}` }]);
}

function addToPlanByOwnActivity() {
  addNewActivityToDatabase();
  const newActivityDiv = document.createElement("div");
  newActivityDiv.classList.add("new-activity");
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.innerText = "x";
  newActivityDiv.appendChild(removeButton);
  const newActivity = document.createElement("li");
  newActivity.innerText = ownActivityInput.value;
  newActivityDiv.appendChild(newActivity);
  personalisedList.appendChild(newActivityDiv);

  clearInput(ownActivityInput);
}

// F: Back To Sorts list content
function updateName() {
  let userName = nameInput.value;
  let lastLetterInName = userName.endsWith("s");
  if (lastLetterInName) {
    userName.innerHTML = `${userName}'`;
  } else {
    userName.innerHTML = `${userName}'s`;
  }
  nameInputSubmitButton.innerHTML = "submitted";
}

function removeActivity() {
  newActivityDiv.firstChild.remove();
}

function deleteEntry(e) {
  const item = e.target;
  if (item.classList[0] === "remove-button") {
    const entry = item.parentElement;
    entry.remove();
  }
}
