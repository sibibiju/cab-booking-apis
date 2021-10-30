# Cab Booking APIs

## Overview

This app is designed for basic cab booking functions such as getting nearby cab details, booking a cab, and viewing the booking history. All the APIs are currently added under 'v1'. This is to help with version management in the future.

## Application Details

- Build using Node.js, express.js framework and mongoDB database.
- Basic Authentication layer setup using JWT tokens.
- Users and cabs can be seeded using the seed scripts.
- API endpoints are defined for login, getting nearby cabs, booking a cab and viewing the booking history.

## Features
- NoSQL Database - MongoDB & object modeling using Mongoose
- Authentication using JWT tokens
- Logging using winston & morgan
- Centralized error handling
- API documentation using swagger & postman
- Process management using PM2
- Security using helmet
- Sanitization and filtering
- Linting using ESLint


## Postman Documentation 

The API documentation & examples are added in postman. It can be accessed by clicking [here](https://documenter.getpostman.com/view/8335742/UVByH9wR)

## Steps to run

- To install all packages run the following command:
```
npm install
```

- Copy all the env variables
```
cp .env.example .env
```

- Start the app in dev mode 
```
npm run dev
```

- Start the app in production mode with PM2 configuration
```
npm start
```
