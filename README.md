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
- You should update this point to include env names needed.
- `FIREBASE_PROJECT_ID`: storage-microservice-4a379.
- `FIREBASE_PRIVATE_KEY`: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDVVPUMeR991xq9\nO4WPdtPb/repIj6jHT7FCh4mGrYsS7Y539U8L4vWltpO/6peaoJMruyYpAxjT+EV\nrJNS129qCFNCOr6/+ghDTEFw0OAbJm8eh8Mf5Aypue1VHPTKPRDg/bWjhoJ2QSBj\nlMW1xxsb3ykD9YaDJP2QV4BI+HHeGVJiAJzKayMKK4pYzxBv58WuERyxvE5K67/m\nzAIGaGi45MS6C304mqcAFv3yzvyIqkNHYuzXovJlxUdzFM0bvB3oc8SN5rptLdZe\nswTN0l0iZLPOtayEvbxLoNSEVNPoeR3aFAcgHbZQMwml4oqA4xhZ8b1dxdNMqEmg\ni9Sr0oSnAgMBAAECggEAAISizbjI60t88fhgNCopNzpl+XVZqpgVFscWA1NYSEDs\n0d9/IJTK+vvweXWkf8iJcCSSnYefIhSdFX+O919fkrsvcenmRwgVQg3q22/JGOJz\nLaNNxYOOcPvAcvmi3I+LvXLQS0k12Dyt6/VTX5l6sYrNX4hBSeCVSbxKAE4I1MMW\nLdKZW394+NU29VZmBaUjdcWbY9nqNGUa1jFvS2RG2FtLOUOfapnOfTxiPBnHtjNF\nvyPGZfkJ+Q4HbjzLsTMWZvOhdQqTSsnYObo6AoO3lA9oc5VQ6YocsLiQrofy+BUj\n3x7ZY3fJ3LsbRn9aRwgXoRoNuggVuy5Xi7xazKNnvQKBgQDy3s0tOImh82cbWon9\nOMToc1l3pMILCnPnKGmi2cYggxfVxTiZk/vfW3Gs/2uGvH0CMvntvSvIVvi5sgJV\nouJEfdbEw8O1Otxps+pjkKw24pZgko53gVC1eFdOTO4yyrQOUwkFlBaj55I7OPHP\nOV4UpnCqZugBIR3I0RspUYGnMwKBgQDg3VvkSgujciUBAOmfnDSnwskTj01Fs8YE\nOg+Pb82Yah4G/RzaK11+7ggCs5DL4JM0FfvVbFNUzAxgSn4SsCh/BCkTFN+8gKP3\nI8HQkPStLMugLtsVnUE7GRvXjYG0GQl9jNp43G4DXbATayBFyTQRmKv40z/HBRcj\nquAgge2cvQKBgC5UnmNgA7FnU2X+cZBiwf1t88VFItckWVPhe7VbQdZ165gWFWQG\nvOew9BCCcSq0zkwbGV5m1fFT1gLmmFdpySwzrUK/7Zem8OEhNzdjI9cchn9Jte/K\nNXFI0a7YMiByVsLcyD3OMDt4M4ckp8xWL0JVNezr0JpWjO4AJeRN7iPNAoGBAISp\n9FHuYYlviWdbK3owRVyIbestS3CJDJVnz9BXLNv0F30WDdSlawa81lsJp66w8wfy\nxF35B/zqWY7hxBmwdmPhh34rfYiP+KyRGwK60q/s0sHRgw3wdhCw0p1Mbi5b6x54\nYFiX7AvuVThPpn2lpCORiDxIHcOEPE+du5dSMGadAoGAeVnGLzdvUxGesAKY8863\nDgyEBe5naag6hmO34VycVynlGL4jVH9akjaogTt8+yQEcSNy5UF10mGw+uEUnlWr\n7X4JcOt30uj4HYvt1uXPTCdvvHrvZ3hxV8h0uwbkyTM2uDSyApF4EXppbBCbfBqS\nvoSC3vYo87QgNPf7b7hON9Y=\n-----END PRIVATE KEY-----\n".
- `FIREBASE_CLIENT_EMAIL`: firebase-adminsdk-6x7by@storage-microservice-4a379.iam.gserviceaccount.com.
- `FIREBASE_STORAGE_BUCKET`: gs://storage-microservice-4a379.appspot.com.

4. **Start the Service**
    ```bash
    yarn start:dev
    
6. **Final considerations and recomendations**
- Keep it simple.
- Be organized in your code.
- Don't forget to provide the necessary environment variable names needed to run and test the project.
- Good luck :).

   
