# Bookstore Backend

## Overview

This project implements a REST backend using Node.js, Express.js, and MySQL to support user (buyer) and seller functionalities. Sellers can manage books via CSV upload, while users can view books. Authentication and authorization ensure proper access control.

## Features

- **User and Seller Registration:**
  - Sign up with name, email, and password.
- **Login Functionality:**
  - Authenticate users and sellers using email and password.
- **JWT Authentication:**
  - Secure endpoints with JWT-based authentication.
- **Seller Capabilities:**
  - Upload books via CSV.
  - View, edit, and delete own books.
  - Restricted access to books owned by others.
- **User Capabilities:**
  - View a list of all books.
  - View details of a specific book.

## Technology Stack

- **Backend:** Node.js, Express.js
- **Database:** MySQL 
- **Authentication:** JWT
- **Language:** JavaScript (TypeScript optional)

## Installation and Setup

### Prerequisites

- Node.js (>=14.x)
- MySQL (or PostgreSQL)

### Steps to Run Locally

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/bookstore-backend.git
   cd bookstore-backend


2. **Install Dependencies:**

   ```bash
   npm install

### API Endpoints

#### Authentication

- **Register:**

  - **POST /api/auth/register**
  - Request Body: 
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password",
      "role": "seller"  // or "user"
    }
    ```

- **Login:**

  - **POST /api/auth/login**
  - Request Body:
    ```json
    {
      "email": "john@example.com",
      "password": "password"
    }
    ```

#### Seller Endpoints

- **Upload Books via CSV:**

  - **POST /api/books/upload**
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `multipart/form-data` with CSV file.

- **View Own Books:**

  - **GET /api/books**
  - Headers: `Authorization: Bearer <token>`

- **Edit a Book:**

  - **PUT /api/books/:id**
  - Headers: `Authorization: Bearer <token>`
  - Request Body:
    ```json
    {
      "title": "New Title",
      "author": "New Author",
      "price": 20.99
    }
    ```

- **Delete a Book:**

  - **DELETE /api/books/:id**
  - Headers: `Authorization: Bearer <token>`

#### User Endpoints

- **List All Books:**

  - **GET /api/books**

- **View Book Details:**

  - **GET /api/books/:id**

### CSV File Format

The CSV file for uploading books should have the following columns:

```csv
title,author,price
Book Title 1,Author 1,19.99
Book Title 2,Author 2,25.99

### Error Handling

The application handles various error scenarios with appropriate HTTP status codes and messages:

- **400 Bad Request:** Invalid inputs or missing required fields.
- **401 Unauthorized:** Missing or invalid JWT token.
- **403 Forbidden:** Access to resources owned by other sellers.
- **404 Not Found:** Resources not found.
- **500 Internal Server Error:** General server errors.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or fixes.

### License

This project is licensed under the MIT License.

