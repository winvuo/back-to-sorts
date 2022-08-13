import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const supabaseUrl = "https://srfxftfqnjzhjapmpmlb.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function loadData() {
  let { data: activities, error } = await supabase
    .from("activities")
    .select("activity");

  console.log(error);
  console.log(activities);
}

loadData();

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
