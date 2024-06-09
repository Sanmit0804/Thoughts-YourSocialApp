# Thoughts - Your Social App

Thoughts is a social media application where users can register, log in, create posts, like posts, and update their profiles. This application is built using Node.js, Express, and MongoDB.

## Features

- User registration and authentication
- Post creation and deletion
- Profile picture upload and update
- Like and unlike posts
- View profiles of other users
- Middleware for protected routes

## Technologies Used

- Node.js
- Express
- MongoDB
- EJS
- bcrypt
- JWT (JSON Web Tokens)
- Multer

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Sanmit0804/Thoughts.git
   cd Thoughts
   ```
   
2. Install Dependencies:
   ```bash
   npm install
   ```

3. Create a '.env' file in the root directory and add your environment variables:
      ```bash
      PORT=3000
      MONGODB_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret
      ```
4. Start the application
   ```bash
   npm start
   ```
   The server will start on http://localhost:3000.

## Directory Structure 
```plain text
.
├── config
│   └── multerConfig.js
├── models
│   ├── post.models.js
│   └── user.models.js
├── public
│   └── uploads
├── views
│   ├── edit.ejs
│   ├── home.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── profile.ejs
│   ├── profileAnother.ejs
│   ├── profileUpload.ejs
│   └── register.ejs
├── .env
├── .gitignore
├── app.js
├── package.json
└── README.md
```


## Usage
### Register
1. Go to http://localhost:3000/register.
2. Fill out the registration form and submit.
### Login
1. Go to http://localhost:3000/login.
2. Fill out the login form and submit.
### Home
1. After logging in, you will be redirected to the home page.
2. You can view all users and their posts.
### Profile
1. Go to http://localhost:3000/profile to view your profile.
2. You can update your profile picture and name.
3. You can create, edit, and delete your posts.
### Logout
1. Click on the logout button to end your session.

## Middleware
### isLoggedIn
This middleware checks if the user is logged in by verifying the JWT token stored in the cookies. If the token is valid, the user is allowed to access the protected routes. Otherwise, they are redirected to the login page.

## ScreenShots
### Home page
![image](https://github.com/Sanmit0804/Thoughts/assets/104015673/bfa4b8bb-d3ee-4640-a75c-cade23513b2c)

