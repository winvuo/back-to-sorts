import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

// fetch database from Supabase API
const supabaseUrl = "https://srfxftfqnjzhjapmpmlb.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const categoryContainer = document.querySelector(".search-by-category");

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

// Query Selectors
const ownActivityInput = document.querySelector("input.add-my-own");
const ownActivitySubmitButton = document.querySelector("button.add-my-own");
const personalisedPlan = document.querySelector(".plan-container");
const nameInput = document.querySelector("input.header-input");
const nameHTML = document.querySelector("#user-name");
const nameInputSubmitButton = document.querySelector("#submit-name");
const keywordInput = document.querySelector("input.search-by-keyword");
const keywordContainer = document.querySelector("#search-by-keyword");
const textOnNameSubmit = document.querySelector(".intro-form-text-end");
const keywordSearchContainer = document.querySelector(
  ".keyword-search-container"
);
const keywordSearchButton = document.querySelector("button.search-by-keyword");
const keywordSearchClear = document.querySelector(".search-by-keyword-clear");

// Event Listeners
ownActivitySubmitButton.addEventListener("click", addToPlanByOwnActivity);
ownActivityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addToPlanByOwnActivity();
});
personalisedPlan.addEventListener("click", deleteEntry);
nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") updateName();
});
nameInputSubmitButton.addEventListener("click", updateName);
keywordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchDatabase();
  }
});
keywordSearchButton.addEventListener("click", searchDatabase);
keywordSearchClear.addEventListener("click", clearSearchResults);

// Callback functions

function clearSearchResults() {
  keywordSearchContainer.innerHTML = "";
}

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

function clearInput(input) {
  input.value = "";
  input.placeholder = "type here";
}

function addToPlanByOwnActivity() {
  const newActivityDiv = document.createElement("div");
  newActivityDiv.classList.add("new-activity");
  const removeButton = document.createElement("button");
  removeButton.classList.add("remove-button");
  removeButton.innerText = "x";
  newActivityDiv.appendChild(removeButton);
  const newActivity = document.createElement("li");
  newActivity.innerText = ownActivityInput.value;
  newActivityDiv.appendChild(newActivity);
  personalisedPlan.appendChild(newActivityDiv);

  clearInput(ownActivityInput);
}

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
  personalisedPlan.appendChild(newActivityDiv);
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
  personalisedPlan.appendChild(newActivityDiv);
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

function updateName() {
  let userName = nameInput.value;
  let lastLetterInName = userName.endsWith("s");
  if (lastLetterInName) {
    nameHTML.innerHTML = `${userName}'`;
  } else {
    nameHTML.innerHTML = `${userName}'s`;
  }
  nameInputSubmitButton.innerHTML = "submitted";
  textOnNameSubmit.style.display = "block";
}
