# File Upload Microservice

Este es un microservicio para la **subida de archivos**, específicamente diseñado para manejar la **subida de fotos**. Este servicio se ha construido utilizando **NestJS**, siguiendo patrones de diseño como **Clean Architecture** y **CQRS** (Command Query Responsibility Segregation) para garantizar una alta escalabilidad, fácil mantenimiento y una separación clara entre la lógica de comandos y consultas.

## Características clave

- **Arquitectura limpia (Clean Architecture)**: Facilita la separación de las responsabilidades dentro de la aplicación, lo que mejora la mantenibilidad y la escalabilidad a medida que el proyecto crece.
- **Patrón CQRS**: Separación de las operaciones de lectura y escritura, lo que optimiza el rendimiento y la claridad en la lógica de negocio.
- **Almacenamiento externo con Firebase**: Utilizamos Firebase como proveedor externo para almacenar los archivos subidos, aprovechando su capacidad de almacenamiento escalable y seguro.
- **Caching con Redis**: Implementamos Redis para caching, lo que mejora el rendimiento general al reducir la latencia en operaciones repetitivas y mejora la eficiencia del sistema.
- **Base de datos con PostgreSQL**: PostgreSQL es la base de datos elegida para este proyecto, donde almacenamos metadatos relacionados con los archivos y otros datos persistentes.

## Requisitos previos

Antes de ejecutar este proyecto, asegúrate de tener instalados los siguientes componentes:

1. **Docker** y **Docker Compose**: El proyecto utiliza contenedores Docker para gestionar los servicios de base de datos y caché.
2. **Node.js**: Para ejecutar el servidor NestJS.

## Configuración y ejecución del proyecto

### 1. Levantar los servicios de base de datos y caché

El primer paso es levantar los contenedores para **PostgreSQL** (la base de datos) y **Redis** (el servicio de caché) utilizando Docker. Desde la carpeta raíz del proyecto, ejecuta el siguiente comando:

```bash
docker-compose up
```

Este comando lanzará los servicios necesarios, incluyendo la base de datos y Redis.

### 2. Iniciar la aplicación NestJS

Una vez que los servicios están corriendo, puedes iniciar la aplicación NestJS con el siguiente comando:

```bash
nest start file-gateway
```

Este comando iniciará el microservicio de subida de archivos, permitiéndote interactuar con los endpoints disponibles.

## Funcionalidades del servicio

### 1. **Subida de fotos con generación de miniaturas**

Este microservicio incluye un endpoint que permite la **subida de fotos**. Al subir una imagen, el sistema generará automáticamente una **miniatura (thumbnail)** de la imagen y proporcionará una URL para acceder tanto a la imagen original como a la miniatura.

### 2. **Autenticación de usuarios (mock)**

Actualmente, el sistema de autenticación de usuarios está **mockeado**. Esto significa que no se está utilizando un sistema de autenticación real, sino que se simula el proceso de autenticación devolviendo únicamente el ID del usuario. Este ID es suficiente para manejar archivos privados en este contexto.

### 3. **Audit logs**

El sistema cuenta con un **sistema de auditoría** que registra cada acción realizada por los usuarios, como la subida, modificación o eliminación de archivos. Estos **audit logs** se almacenan en la base de datos y permiten tener un seguimiento completo de quién hizo qué y cuándo.

Para evitar sobrecargar el flujo principal de las peticiones, los logs se procesan mediante **eventos de CQRS**, lo que asegura que el registro de auditoría no afecte el rendimiento general del sistema.

## Estructura del proyecto

El proyecto sigue el patrón de **Clean Architecture**, dividiendo las capas de la aplicación en:

- **Controladores**: Manejan las peticiones HTTP.
- **Servicios**: Implementan la lógica de negocio.
- **Repositorios**: Gestionan la persistencia y recuperación de datos desde la base de datos.
- **Módulos**: Agrupan diferentes partes de la aplicación y organizan la lógica en unidades reutilizables.

Además, el patrón **CQRS** divide la aplicación en:

- **Comandos**: Para operaciones que modifican el estado del sistema (como la subida de un archivo).
- **Consultas**: Para operaciones de lectura de datos (como obtener un archivo o su miniatura).

## Tecnologías utilizadas

- **NestJS**: Framework principal para la construcción del microservicio.
- **Firebase**: Para el almacenamiento externo de archivos.
- **PostgreSQL**: Base de datos relacional utilizada para almacenar los metadatos de los archivos.
- **Redis**: Sistema de caché para mejorar el rendimiento.
- **Docker**: Para orquestar los servicios de Redis y PostgreSQL.
- **CQRS**: Patrones de segregación de comandos y consultas para mejorar el rendimiento y la escalabilidad.

## Consideraciones futuras

En futuras versiones del microservicio seria interesante:

- Mejorar la generación de miniaturas, incluyendo diferentes tamaños y formatos.
- Extender las capacidades de almacenamiento a otros proveedores como Amazon S3.
