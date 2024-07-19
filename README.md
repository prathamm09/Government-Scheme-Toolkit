Project Overview
This project aims to integrate front-end and back-end development skills to create an application that allows users to search for government schemes based on various input parameters. The application involves designing a user-friendly interface, handling user input, querying a database, and displaying the results.

Key Features
Search Interface:

A form where users can input search criteria such as scheme name, type, eligibility, and benefits.
Responsive Design:

Ensures that the application is usable on various devices, including desktops, tablets, and mobile phones.
Backend Processing:

Handles user input, queries the MySQL database, and returns relevant results.
Result Display:

Shows the search results in a clear and organized manner.
Error Handling:

Provides feedback if no results are found or if there is an issue with the input.
Technologies Used
Frontend: HTML, CSS, JavaScript, Bootstrap (for responsive design)
Backend: Node.js/Express.js
Database: MySQL
Project Structure
frontend/: Contains all the front-end code including HTML, CSS, and JavaScript files.

index.html: The main HTML file containing the search form.
styles.css: Custom CSS styles for the application.
script.js: JavaScript for handling user interactions and AJAX calls.
backend/: Contains the back-end code including server setup and database queries.

app.js: Main server file that handles routing and logic.
database.js: Database connection and query functions.
Installation and Setup
Clone the repository:

bash
Copy code
git clone https://github.com/yourusername/government-schemes-search.git
Navigate to the project directory:

bash
Copy code
cd government-schemes-search
Install dependencies:

bash
Copy code
npm install
Setup the database:

Import the provided SQL file (database/schema.sql) to set up the MySQL database with necessary tables and sample data.
Configure database connection:

Update backend/database.js with your MySQL database credentials.
Run the application:

bash
Copy code
npm start
Open in browser:

Navigate to http://localhost:3000 to view the application.
Usage
Search for Schemes:

Enter search criteria in the form and submit to see matching schemes.
Responsive Design:

Use the application on any device – it adapts to desktops, tablets, and mobile phones.
Error Handling:

Receive feedback for invalid input or if no schemes match the search criteria.
Contribution
We welcome contributions! Please fork the repository and create a pull request with your changes. Ensure your code adheres to our coding standards and includes tests where applicable.
