# Procrastinot

[My Notes](notes.md)

## Sections
- [Specification Deliverable](#-specification-deliverable)
- [AWS Deliverable](#-aws-deliverable)
- [HTML Deliverable](#-html-deliverable)
- [CSS Deliverable](#-css-deliverable)
- [React part 1: Routing Deliverable](#-react-part-1-routing-deliverable)
- [React part 2: Reactivity Deliverable](#-react-part-2-reactivity-deliverable)
- [Service Deliverable](#-service-deliverable)
- [DB Deliverable](#-db-deliverable)
- [WebSocket Deliverable](#-websocket-deliverable)

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] Proper use of Markdown
- [X] A concise and compelling elevator pitch
- [X] Description of key features
- [X] Description of how you will use each technology
- [X] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Frustrated with switching between Learning Suite, Canvas, and a thousand other platforms for school assignments? Tired of losing track of your new years resolutions? Wouldn't it be great if there was just a single place to keep track of everything... if only... but wait! Look no farther than **Procrastinot**, an all new platform designed to let you focus on what matters most: the homework itself, your goals, and your gospel study! Find all you homework assignments in one place, keep track of and review your personal goals, and create a personalized gospel study plan for the week.  

### Design

Here's a sketch demonstrating a basic design including some of the features:

![Design image](DesignSketch.jpg)


### Key features

- Secure login to access your personal dashboard
- All homework assignments displayed in one place and ranked by priority
- Task manager for any other non-school related tasks
- Personal goals tracker with progress indicators
- Customizable gospel study plan on a week by week basis
- Suggested goals from ChatGPT

### Technologies

I will use the required technologies in the following ways:

- **HTML** - Give the structure of the entire application. Multiple HTML pages, including one for login, one for the main dashboard, another for tracking goals, and another for gospel study plans. 
- **CSS** - Provide style to the website with a good color scheme, fonts, and use of whitespace. 
- **React** - Display assignment status including the due date and submission status. Allow users to add, edit, and delete tasks and goals. Shows progress towards goals and gospel study plan. 
- **Service** - Backend service with endpoints for the following:
    - Retrieving assignments and updating their status
    - Login and logout functionality
    - Suggest goals using ChatGPT API
    - Send notifications for upcoming assignments and tasks
- **DB/Login** - Store login credentials securely. Store personalized user data including their assignments, goals and progress towards them, and their gospel study plan. 
- **WebSocket** - New assignments or adjusted due dates are updated immediately on the webpage. _Possibly (time permitting) display grades of assignments as they are graded._

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Server deployed and accessible with custom domain name** - [My server link](https://procrastinot.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **HTML pages** - 5 HTML Pages for all the different parts of my website 
- [X] **Proper HTML element usage** - I used a variety of different elements to create the desired structure
- [X] **Links** - The Navigation bar links between the different pages
- [X] **Text** - Text displayed on multiple pages, especially the home page
- [X] **3rd party API placeholder** - Created spot for ChatGPT 3rd party API on the Goals page
- [X] **Images** - Pres Nelson!
- [X] **Login placeholder** - Login placeholders on the opening page and navigates to home page when submit is clicked
- [X] **DB data placeholder** - DB data will be used to store personalized user data (assignments, etc.)
- [X] **WebSocket placeholder** - Indicated spot where WebSocket data will be displayed (live assignments and due dates), see trending things that are being studied by others worldwide

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Header, footer, and main content body** - Header, footer, and main content body all have custom formatting
- [X] **Navigation elements** - Navigation bar at the top uses tabs to switch pages
- [X] **Responsive to window resizing** - All pages and elements automatically adjust size based on window resizing for all devices
- [X] **Application elements** - Variety of different elements with different formatting. Everything is visually appealing. 
- [X] **Application text content** - Modified text sizes, style, etc. in various different parts of the website
- [X] **Application images** - Image on the main page is responsive and has an animation

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Bundled using Vite** - Bundled using Vite and then reorganized my code. So much more modular!
- [X] **Components** - Assignments, Goals, GospelPlan, Home, and Login!
- [X] **Router** - Routing between all the different pages

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **All functionality implemented or mocked out** - The website is now fully functional and I've mocked out a few API calls and Websocket functionality, such as the live feed of the graded assignments or the generated goal suggestions. Even though I implemented so much, I've only had even more ideas about what I could add!
- [X] **Hooks** - Many uses of useState and useEffect throughout the startup to manage all the different tables, store all data in local storage, etc.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Node.js/Express HTTP service** - Setup backend server using express and defined specific routes such as /api/verse or /api/assignments
- [X] **Static middleware for frontend** - Used middleware to allow the server to serve HTML, CSS, and JS files from the public folder
- [X] **Calls to third party endpoints** - Implemented the /api/verse route which uses the Scriptures API (api.nephi.org). This part ended up being very confusing, particularly formatting the request to the API right, but thankfully it worked out in the end. 
- [X] **Backend service endpoints** - I created a few different backend service endpoints, including /api/verse, /api/assignments/ and the login and logout endpoints
- [X] **Frontend calls service endpoints** - My login, home, and assignments page all use fetch to call service endpoints
- [X] **Supports registration, login, logout, and restricted endpoint** - I mirrored the Simon registration, login, logout, and restricted endpoint implementation, and it now works on my startup


## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Stores data in MongoDB** - My startup stores a user's assignments, goals, gospel study plan, and recently read items (from their plan) in MongoDB. This ended up being very repetetive and a bit tedious but it worked out. 
- [X] **Stores credentials in MongoDB** - Login information is stored in mongoDB to allow each user to have personalized goals, assignments, and gospel study plans.


## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [X] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [X] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [X] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [X] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [X] **Application is fully functional** - I did not complete this part of the deliverable.
