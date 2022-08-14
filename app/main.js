import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = "https://srfxftfqnjzhjapmpmlb.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function turnResponseIntoJSObject(response) {
  return response.json();
}

async function loadCategoryNames() {
  let { data: categories, error } = await supabase
    .from("categories")
    .select("category_name");

  const categoryContainer = document.querySelector(".search-by-category");
  return categories.forEach((category) => {
    let newCategory = document.createElement("li");
    newCategory.classList = "rendered-sidebar-text";
    newCategory.innerHTML = `* ${category.category_name}`;
    categoryContainer.appendChild(newCategory);
  });
  // return categories.forEach((category) => {
  //   let newCategory = document.createElement("li");
  //   newCategory.innerText = category;
  //   categoryContainer.appendChild(newCategory);
  // });
}

loadCategoryNames();

// Query Selectors
const ownActivityInput = document.querySelector("input.add-my-own");
const ownActivitySubmitButton = document.querySelector("button.add-my-own");
const personalisedPlan = document.querySelector(".plan-container");
const nameInput = document.querySelector("input.header-input");
const nameHTML = document.querySelector("#user-name");
const nameInputSubmitButton = document.querySelector("#submit-name");

// Event Listeners
ownActivitySubmitButton.addEventListener("click", addToPlan);
ownActivityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") addToPlan();
});
personalisedPlan.addEventListener("click", deleteEntry);
nameInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") updateName();
});
nameInputSubmitButton.addEventListener("click", updateName);

// Callback functions
function clearInput(input) {
  input.value = " ";
}

function addToPlan() {
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
}
