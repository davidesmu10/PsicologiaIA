# 🧠 PsicologiaIA - Plataforma de Apoyo Psicológico con IA

¡Bienvenido a **PsicologiaIA**! Una plataforma web moderna diseñada para ofrecer interacción y acompañamiento psicológico virtual mediante inteligencia artificial. El sistema integra un ecosistema completo utilizando una arquitectura limpia en el backend, una interfaz fluida y reactiva en el frontend, y contenedores Docker para la gestión de su infraestructura.

---

## 🚀 Características Principales

* **Asistente Virtual Empático (Escobar):** Integración con modelos de lenguaje avanzados (**Meta-Llama-3-8B-Instruct**) utilizando el router de Hugging Face de manera optimizada y fluida.
* **Contexto e Historial en Base de Datos:** Sistema de memoria persistente que recupera de manera ordenada los últimos 10 mensajes del usuario para mantener la coherencia clínica de la conversación.
* **Infraestructura Contenerizada:** Entorno de base de datos SQL Server completamente administrado y configurado mediante **Docker Compose**.
* **Suite de Pruebas Unitarias:** Cobertura de código automatizada con **xUnit** y **Moq** para validar flujos críticos en los controladores de mensajería (`ChatController`) y gestión de usuarios (`UserController`).

---

## 🛠️ Tecnologías y Herramientas

### Backend (.NET)
* **.NET 8.0 / 9.0 (ASP.NET Core Web API)**
* **Entity Framework Core** (Enfoque Code-First)
* **SQL Server** como motor de base de datos relacional
* **xUnit & Moq** para aislamiento de datos en memoria (`InMemoryDatabase`) y simulación de peticiones HTTP (`HttpMessageHandler`)

### Frontend (React)
* **React.js** con **TypeScript** y empaquetado ultra rápido vía **Vite**
* Gestión de estados locales y consumo asíncrono de APIs mediante Fetch/Axios

### DevOps & APIs Externas
* **Docker & Docker Compose**
* **Hugging Face Inference API** (Chat Completions compatible con OpenAI standard)

---

## 📦 Estructura de la Solución

```text
PsicologiaIA/
├── PsicologiaIAAPI/            # Proyecto Web API Principal (.NET)
│   ├── Controllers/            # Controladores (ChatController, UserController)
│   ├── Data/                   # Contexto de base de datos (ApplicationDbContext)
│   ├── Models/                 # Entidades y DTOs (User, Psychologist, ChatLog, ChatRequest)
│   └── appsettings.json        # Configuraciones locales de la app
├── PsicologiaIPruebasUnitarias/# Proyecto de pruebas unitarias (xUnit)
│   ├── ChatControllerTests.cs  # Pruebas para flujos de IA e interactividad del chat
│   └── UserControllerTests.cs  # Pruebas para registros y disponibilidad de psicólogos
├── psicologia-ia-frontend/     # Proyecto Frontend en React (TS + Vite)
│   ├── src/                    # Componentes, estilos y lógica del chat
│   ├── package.json            # Dependencias del Front
│   └── vite.config.ts          # Configuración de Vite
├── docker-compose.yml          # Orquestación del contenedor SQL Server
└── README.md                   # Documentación general del sistema


Configuración e Instalación
1. Levantar la Base de Datos (Docker)
Sitúate en la raíz de la solución donde se encuentra el archivo docker-compose.yml y ejecuta en tu terminal:

Bash
docker compose up -d
2. Configurar y Correr el Backend
Dirígete a la carpeta interna del backend y abre el archivo appsettings.json para configurar tu cadena de conexión y tu token secreto de Hugging Face:

JSON
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=PsicologiaIADB;User Id=sa;Password=TuPasswordSeguro123!;TrustServerCertificate=True;"
  },
  "HuggingFaceToken": "tu_token_real_de_hugging_face_aqui"
}
Posteriormente, aplica las migraciones para construir las tablas en la base de datos y arranca el servidor:

Bash
cd PsicologiaIAAPI/PsicologiaIAAPI
dotnet ef database update
dotnet run
La API levantará por defecto en los puertos configurados (ej. http://localhost:5000 o https://localhost:5001).

3. Configurar y Correr el Frontend
En otra terminal, navega hacia la carpeta del cliente en React, instala los paquetes necesarios y enciende el servidor de desarrollo de Vite:

Bash
cd psicologia-ia-frontend
npm install
npm run dev
Abre el navegador en la ruta local indicada por Vite (usualmente http://localhost:5173).

4. Ejecutar Pruebas Unitarias
Para validar que los endpoints, los filtros de seguridad, las excepciones de negocio y los mocks del cliente HTTP estén respondiendo correctamente y pasen el control de calidad:

Bash
cd PsicologiaIPruebasUnitarias
dotnet test
