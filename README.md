I created Back To Sorts for my final project in the General Assembly JavaScript Development course.

The brief was to use JavaScript to correctly structure the code for a SPA, letting JavaScript update the page and following best practices:

- Well-formatted code
- Clean and readable code
- Following F.I.R.S.T principles
- Keeping code D.R.Y
- Modular code
- Regular commits
- Hiding API keys

## Links

Deployed site: https://back-to-sorts.vercel.app/

## Project Overview

My project, Back To Sorts, is a space for visitors to reflect, reorient, and find inspiration when they’re feeling out of sorts. With the help of community posts and a database of activity ideas, users can build their own tailored Back To Sorts list.
A Back To Sorts list can be used however works best for each individual: such as, a personal guide to help find balance in times of need, a weekly self-care checklist, a reference used to plan free time, or a tool to share with supportive loved-ones.
It is my hope that the Back To Sorts project will provide a tool and a supportive community that prompts us to set aside time for rejuvenation and brighten our days.

| Tech Stack       |                                     |
| ---------------- | ----------------------------------- |
| `Languages`      | HTML5 <br/>CSS <br/>JavaScript(ES6) |
| `Procedures`     | APIs <br/>AJAX <br/>DotEnv          |
| `Database`       | Supabase                            |
| `Build Tool`     | Parcel                              |
| `Deployment`     | Vercel                              |
| `Source Control` | Git <br/>GitHub                     |

## Code Walk-Through

The app consists of two main sections:

1. An intro section with 3x scroll pages (header, a welcome/description and user personalisation form)
2. The main app section (navigation bar on the left and Back To Sorts list on the right)

On page load, the loadCategories() function makes API calls to my Supabase databases (one call for the category database, and a second call to the activities database). The two databases are connected by a foreign key relation. The API calls load the category names and corresponding activities in a dropdown menu in the “add activity by category” section of the navigation bar.

The remainder of the main.js file is structured into 3 sections:

1. Query Selectors
2. Event Listeners
3. Functions
   - The displayWeather() function is called when the user enters their city in the personalisation form. It makes two API calls to Openweather. The first to fetch geolocation data (latitude and longitude) and a second to fetch weather data. Depending on the “feels like” temperature, different data is rendered on the page. Currently, no matter the weather, the suggested activity is a walk, which is called by the searchDatabaseForWalk() function that makes a Supabase API call.
   - The addActivityToList() function allows users to click on an activity and render it on the Back To Sorts list.
   - When a user chooses to add their personalised activity, three functions are called. The first, addActivityToListByUser() renders the input on the page, the second, addNewActivityToDatabase() makes a POST request and records the user input in my Supabase database, and the third, clearInput(), clears the input field.
   - The updateName() function renders the user’s name at the top of the Back To Sorts list (obtained from the personalisation form).
   - The deleteEntry() function allows users to remove activities from their Back To Sorts list.

## My Learnings

- This project is my first time working with databases and self-learning Supabase. I learnt how to set up foreign tables and how to filter and fetch the data as needed. This process of figuring out how to render the categories and the corresponding activities was particularly rewarding.
- Getting more comfortable with DOM manipulation.
- It was enjoyable to design the look of the app, and successfully translate that onto the page with little compromise in CSS through more practice.

## What’s Next (in no particular order)

- Make the app responsive for mobile.
- Use the Google Maps API to allow place autocompletion in the personalisation form.
- Use the Instagram API to show posts from the community.
- Expand the activity database.
- Add and improve accessibility.
- Add user authentication.
- Integrate a screenshot API to allow users to save a copy of their Back To Sorts list.

As I continue to learn, the next big step will be to migrate the app to React.
