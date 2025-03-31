# Sistema de Gestión de Tareas API

API RESTful para la gestión de tareas desarrollada con Node.js.

## Características

- Endpoints para listar, crear, actualizar y eliminar tareas
- Contenerizada con Docker
- Pipeline de CI configurado con Jenkins

## Requisitos

- Node.js v14+
- Docker
- Jenkins (para CI)

## Instalación

```bash```
npm install
npm start


## Running Locally

1. Install dependencies: `npm install`  
2. Start the server: `npm start`

## Running with Docker

1. Build the image: `docker build -t task-api .`  
2. Run the container: `docker run -p 3000:3000 task-api`

