# Proyecto de Microservicio de Imágenes

## Descripción

Este microservicio está diseñado para manejar la carga y gestión de imágenes, utilizando NestJS y PostgreSQL, con integración a Firebase para el almacenamiento.

## Prerrequisitos

- Node.js (versión 20 o superior)
- PostgreSQL (versión 14 o superior)
- Cuenta de Firebase

## Variables de Entorno

Asegúrate de crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=tu_usuario
DATABASE_PASSWORD=tu_contraseña
DATABASE_NAME=nombre_de_la_base_de_datos

# Firebase
FIREBASE_PROJECT_ID=tu_project_id
FIREBASE_PRIVATE_KEY=tu_private_key

# Otros
JWT_SECRET=tu_secreto_jwt


```

# Firebase

Cuando se inicializa el servicio de firebase debes importar el json con la key que descargas desde FireBase en la web

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

   ```

2. **Install dependencies**

   ```bash
   yarn install

   ```

3. **.env variables**

- You should update this point to include env names needed.

4. **Start the Service**

   ```bash
   yarn start:dev

   ```

5. **Final considerations and recomendations**

- Keep it simple.
- Be organized in your code.
- Don't forget to provide the necessary environment variable names needed to run and test the project.
- Good luck :).
