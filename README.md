# Image Storage Microservice

This microservice implements a basic CRUD for uploading, storing, and retrieving images using NestJS. Images are externally stored in Firebase Storage, and the endpoints support file upload, retrieval, and validation.

## Project Description

This project provides a scalable and efficient image storage microservice, featuring:

- **Image upload** (with type and size validation).
- **Storage in Firebase Storage**.
- **Image retrieval** via public URLs.
- **Security with JWT authentication** to protect access to the endpoints (Mocked data, not real authentication process required).


### Additional Features (Optional)

- Thumbnail generation (for image resizing).
- Audit logs to track who uploaded which file and when.
- **Redis integration** to cache URLs and improve performance.

---

## Prerequisites

Before starting, make sure you have the following installed in your local environment:

- [Node.js](https://nodejs.org/) (version 20 or higher).
- [NestJS](https://nestjs.com/) (already included in the template).
- [Firebase CLI](https://firebase.google.com/docs/cli) (if using Firebase Storage).
- Redis (optional for URL caching).

---

## Required Stack

You should use the following tech stack during this project:

- TypeORM.
- PostgreSQL.
- Redis (optional).
  
---

## Project workflow

- You should create a forked repository and make a PR when you complete the project.
- A guideline of the tasks required can be found in the issues of this repo and in the following project:
  [Cute Digital Media Project](https://github.com/orgs/Cute-Digital-Media/projects/4/views/1)
- Each issue contains the description needed to handle the task.

---

## Installation and Setup

1. **Clone the Repository**

   Clone the GitHub repository to your local machine:

   ```bash
   git clone <REPOSITORY_URL>
   cd <PROJECT_NAME>
   
2. **Install dependencies**
   ```bash
   yarn install
   
3. **.env variables**
   ```bash
   TYPE=service_account
   PROJECT_ID=<your_project_id>
   PRIVATE_KEY_ID=<your_private_key_id>
   PRIVATE_KEY=<your_private_key>
   CLIENT_EMAIL=<your_client_email>
   CLIENT_ID=<your_client_id>
   UTH_URI=<your_client_uth_uri>
   TOKEN_URI=<your_client_token_uri>
   AUTH_CERT_URL=<your_client_auth_cert_url>
   CLIENT_CERT_URL=<your_client_cert_url>
   UNIVERSAL_DOMAIN=googleapis.com

   DATABASE_PORT=<database_port>
   DATABASE_HOST=<host>
   DATABASE_USER=<db_user>
   DATABASE_PASSWORD=<db_password>
   DATABASE_NAME=<db_name>

   JWT_SECRET=<jwt_secret>

4. **Start the Service**
    ```bash
    yarn start:dev
    
6. **Final considerations and recomendations**
- Keep it simple.
- Be organized in your code.
- Don't forget to provide the necessary environment variable names needed to run and test the project.
- Good luck :).

   
