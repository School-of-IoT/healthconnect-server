
# 🩺 HealthConnect Server - Medis

This is the backend server for **Medis**, formerly known as **HealthConnect**, a health data platform designed to store, retrieve, and manage patient health records securely and efficiently. It supports real-time data ingestion from IoT medical devices and serves APIs for mobile and web applications.

---

## 🚀 Features

- RESTful API endpoints for managing:
  - Patients
  - Devices
  - Health data (e.g., vitals, diagnostics)
- JWT-based authentication
- MongoDB integration (Mongoose ORM)
- Real-time data ingestion support (MQTT/WebSocket-ready)
- Modular architecture for easy extension

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT, JIT
- **Data Models**: Patient, Device, HealthData

---

## 📦 Installation

1. **Clone the repository**
    ```
    git clone https://github.com/<your-org>/healthconnect-server.git
    cd healthconnect-server
    ```

2. **Install dependencies**
    
    ```
    npm install
    ```
    (Setup .env file as per requirement)

3. **Start the server**

    ```bash
    npm start
    ```

---

## 📚 API Documentation

The API is organized around standard REST principles.

### 📄 Example Endpoints

* `POST /api/patients` – Create a patient
* `GET /api/patients/:id` – Retrieve patient profile
* `POST /api/devices` – Register a new medical device
* `POST /api/data` – Submit health data

Postman colllection available [here](https://github.com/School-of-IoT/healthconnect-server/blob/dev/tests/p-collection.json). URL test status in the bottom this document.

---

## 🧱 Folder Structure

```
healthconnect-server/
├─ .gitignore
├─ .node-version
├─ 404.html
├─ LICENSE
├─ README.md
├─ SECURITY.md
├─ connection.js
├─ package.json
├─ server.js
└─ src
   ├─ models
   │  ├─ deviceModel.js
   │  ├─ healthModel.js
   │  └─ patientModel.js
   ├─ v1
   │  ├─ controllers
   │  │  ├─ deviceControl.js
   │  │  └─ patientControl.js
   │  └─ routes
   │     ├─ deviceRoutes.js
   │     └─ patientRoutes.js
   └─ v2
      ├─ controllers
      │  ├─ deviceControl.js
      │  └─ patientControl.js
      └─ routes
         ├─ deviceRoutes.js
         └─ patientRoutes.js
```

## 📈 Future Enhancements

* Data analytics engine
* HL7/FHIR interoperability
* Device firmware over-the-air (FOTA) integration

---

## 🧑‍💻 Contributing

- Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
- For security related issues, refer to [Security Policy](https://github.com/School-of-IoT/healthconnect-server/security/policy)

---

## 💬 Status

![API Test - Dev](https://github.com/School-of-IoT/healthconnect-server/actions/workflows/test.yml/badge.svg?branch=dev)

