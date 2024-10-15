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
- Add some env variables for your project.
- Add the following variables to your .env file:
   ```bash
    DATABASE_HOST = localhost 
    DATABASE_PORT = 5432
    DATABASE_USERNAME = root
    DATABASE_PASSWORD = 123456
    DATABASE_NAME = testdatabase
    JWT_SECRET = 'secret'
    TYPE= service_account,
    PROJECT_ID= nest-test-firebase-3e689
    PRIVATE_KEY_ID=b90921c4c8cf9b87e0c672e6d43f9a2bbe6aac52
    PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCwdV6FucmQVtvl\n5SOs2z2m549E0Kwm6XWzVQbSpvbIj1CZ2yqCT+w3nU8JpBcptxUljniMe4pSgA7x\nDuSwaWiEwHD+2tH3L3mgkp1V8HPD/qAnb2QEMRKkIFWgps8QUM6YVaXRZvaQXTx6\nWaqbsjRJA2GIOBvrr8dUNxCswagQIQh6kS6//zds/GV0gSWaKb/1vu88sqMqe+NC\nw1vQE/FYKBCD/UHFp7RrYiSKA0TksrFloGL192Muky2glZEQkYqWrPn0ZsNaeP0j\n2pKY3NCGh0MXRMEeWYIWsFyw4pv/UT7pTJXTosU/7oORO+zx2VQzOPGIg9egm3mN\n4B5LsaABAgMBAAECggEAUoz+BNp3OQ7hfeoWKAJDE+eFh2CGAQg794MCF59jmU0u\nnGPDPcZtEFGIDc8VxP6xJmpB7BrJibH+C3j3tK4DZwNueVPeYWD06hFdCLzeM6VV\nwE0kwa9BdMXpuSgAe7YKCIsc8VtVYxEzP1vebEtQmY263ZK+QSLxQe0m4GMSoERE\nzBELUnCyh4zYUKwPV1NqjTjsURR26VKncQPEvAznJletO3SKxEOC6rFCZwWbuVwN\n/2atshNYjEUIwF9kjWyc9430Ycqc1uYZW0dJWrnkfRCsoFiE0HqkWWzQfp/tYMrT\nDqNXXkvGtVE99xiSzCs/wD3RGzgdNKGnHUYRy/OCjwKBgQDfPSpESNMlTycRbKhQ\ngfxF42VCHYv1khE4sMFp3RIKm9NOFu6nb19kU1wXCMmTP/K/wbBA17F4umU2z2G7\nZsQs4ZcbnFUokK+Gj9nUA6orlFVbkP14dTgujj48YhO01RfWpjGVY3z0xZx2bJhx\n68Mqn52o3Ei+panNtw666JHlbwKBgQDKWrcZh3dxyDQGMaJu+TO2AmgXgZSAt5PW\nOtv1u7OXXFKXkud/v7EhWrDjbp0WbggHWraSwkEIy8OLyU56uSS/U8+o8wYjqW+v\nK3ZmatqiyKlq1k5BKrCbEbPG6VWCfWYb66E/10mBZXNeZ42q65WAWPlP3rdHv93J\n0uRZmM95jwKBgFJgx9Aa74+8/bW4WwQac3V2zE7xiEw+coxw7W6bXaT8i6UtYTP4\nLUNgX4NAguILnxCT8O58qcjbP65SKMZ2zb2iIZjWv7YQbjVBsChEke8y9aysfFyP\nJQRJCT5PEuaQHBPhkDqIU/wfT/WDbV3cmlCIRi2h3FY928NF4fGnEO+RAoGAGsz5\nA0CV6VQCz+8y/E+1MZ4P+00GRiYKRo11JI6/soRfzAOA9cKFy00fsH+t/pKELbUu\nCTIBOxEBzTnUUxzCaTTIhC/r2D1QtXqkK9xrKLQ6/BN2OdtVmLQ3g1jUInxJUdlb\negEhkynEpfRBJyocmust2g49aBtZXKm55MQAdrECgYEAqypipWe64PY0MAundEH/\nmxd/LK81AC7aRsUHbTn6AIR7207xPo4vCGr6GH1xp89f7S/wHcB4KOGIVDiGBz6J\nPIN5KW78vJXzIbzz9gWrhEyJ1dXryByaLnkthd1VoQ00deMDUkg00OM6sTXCEyba\nVgGjE6mwEoIDc5Mnx6KkXG0=\n-----END PRIVATE KEY-----\n
    CLIENT_EMAIL=firebase-adminsdk-azvff@nest-test-firebase-3e689.iam.gserviceaccount.com
    CLIENT_ID=116805137419380522742
    AUTH_URI= https://accounts.google.com/o/oauth2/auth
    TOKEN_URI= https://oauth2.googleapis.com/token
    AUTH_CERT_URL= https://www.googleapis.com/oauth2/v1/certs
    CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-azvff%40nest-test-firebase-3e689.iam.gserviceaccount.com
    UNIVERSAL_DOMAIN= googleapis.com
    REDIS_HOST = localhost
    REDIS_PORT = 6379
    CACHE_TTL = 60
   ```
3.1 **Docker**
- Note: In this case I use docker for the database and redis services, so you will need to launch the next command in terminal.
    ```bash
  docker-compose up -d
    ```
  3.2 **migrations**
- Note: For create and populate tables of database run the next command.
    ```bash
  yarn run migration:run
    ```
4. **Start the Service**
    ```bash
    yarn start:dev
    
6. **Final considerations and recomendations**
- Keep it simple.
- Be organized in your code.
- Don't forget to provide the necessary environment variable names needed to run and test the project.
- Good luck :).

   
