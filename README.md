# Book Search Engine

## Description

The Book Search Engine is a web application that allows users to search for books using the Google Books API. Users can view detailed information about books, create an account, save books to their profile, and manage their saved books. This application features user authentication (login/signup), enabling users to securely save books they are interested in.

## Table of Contents

- [Description](#description)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [Screenshots](#screenshots)
- [Deployment on Render](#deployment-on-render)
- [Deployed Application](#deployed-application)
- [License](#license)

## Technologies Used

- **React**: Frontend JavaScript library for building the user interface.
- **Apollo Client**: For handling GraphQL queries and mutations.
- **GraphQL**: To interact with the backend and manage data for user authentication and saved books.
- **Google Books API**: Fetches book data based on user search queries.
- **Bootstrap**: CSS framework used for responsive design and styling.
- **JWT Authentication**: JSON Web Tokens (JWT) for securing user authentication.
- **MongoDB & Mongoose**: NoSQL database and ORM used to store user and book data.

## Installation

1. Clone the repository
2. Navigate to the project directory: cd book-search-engine
3. Install the dependencies: npm install
4. Build the application: npm run build
5. Start the development server: npm run dev

## Usage

### Searching for Books

- Upon loading the application, users are presented with a search input field and options to log in or sign up.
- Unauthenticated users can still search for books and view the results (title, author, description, image, and a link to the Google Books page).

### Logging In/Signing Up

- Users can sign up for a new account by entering their username, email address, and password.
- Existing users can log in using their email address and password.
- Once logged in, the menu will update to include the option to view saved books and to log out.

### Saving Books

- Logged-in users will see a "Save" button next to each book in the search results.
- Clicking "Save" will add that book to their saved books collection.

### Viewing Saved Books

- Users can view all the books they have saved by clicking the "Saved Books" option in the menu.
- From the saved books page, users can remove any book by clicking the "Remove" button.

### Logging Out

- Users can log out of the application by clicking the "Logout" button, which will return them to the default state with options to search for books and log in/sign up.

## Features

- **Google Books API Integration**: Fetch book information based on user search queries.
- **User Authentication**: Users can sign up, log in, and securely manage their account information.
- **Save Books to Profile**: Authenticated users can save and manage a collection of their favorite books.
- **Responsive Design**: Works across all devices, providing a seamless experience for both desktop and mobile users.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## Screenshots

## Deployment on Render

To deploy the application using Render

1. **Push to GitHub**
2. **Deploy on Render**
3. **Access Application**

## Deployed Application

## License

This project is licensed under the [MIT LICENSE](LICENSE).

> [!NOTE]  
> Recourses used for creating code. Referred back to class work for file format such as reviewing class recording. Worked with peers on assignment and compared challenge template to assist with creating readme file.
