# Library Management System
This project is a full-stack web application for managing a library. It includes features for adding students, updating payment history, and retrieving student details. The system also has authentication using a secret key to ensure that only authorized users can access the application.

Features :
    CRUD Operations: Perform Create, Read, Update, and Delete operations on student records.
    Payment Tracking: Manage and track student payments with a history log.
    Search Students: Retrieve student details by name or Aadhaar number.
    Authentication: Protect access to the system using a secret key authentication mechanism.
    Secret Key Management: The library owner can change the secret key.

Tech Stack
    Frontend :
    React.js: Frontend library for building the user interface.
    React Router: For managing navigation between different components (SignIn, AppContent, and ChangeKey).
    LocalStorage: Used to store and access the secret key on the client side.
    CSS Modules: For styling individual components, ensuring maintainability and modular design.

Backend:
    Express.js: Web framework for building the API to handle CRUD operations and authentication.
    RESTful API: Endpoints to manage student data and secret key authentication.
    Mongoose: ODM (Object Data Modeling) library for MongoDB to interact with the database.
    CORS: Middleware to allow secure cross-origin requests between the frontend and backend.

Database:
    MongoDB: NoSQL database to store student records and secret key information.
    Mongoose Schema: Defined for both students and secret keys

Installation
1.Clone the repository:
   https://github.com/sunish2809/Library
2.Backend Setup
  2.1. Navigate to the backend folder and install the necessary dependencies:
        cd backend
        npm install
  2.2. Create a .env file in the backend folder with the following variables:
        MONGO_URI= Your MongoDB URL
        FRONTEND_URL= Your Frontend URL
  2.3. Start the backend server:
        npm start

3.Frontend Setup
  3.1. cd frontend
       npm install
  3.2. Start the frontend development server:
       npm run dev


