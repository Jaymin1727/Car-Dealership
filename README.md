# M MOTOR — Car Dealership Inventory System

A premium, full-stack application featuring a beautiful React SPA styled with responsive glassmorphism, a robust Spring Boot backend REST API, JWT-based security, and a MySQL database.

---

## 🌟 Features

### Frontend (React + Vite)
- **Premium UI/UX**: Dark mode by default, custom styled typography, and glassmorphism design.
- **Dynamic Inventory**: Live view of vehicles fetched from database with real-time stock management.
- **Search & Filters**: Instantly filter vehicles by category (Sedan, Coupe, SUV, Sports, Electric, Luxury), search query, sorting, and price range.
- **Interactive Purchase Flow**: Users can sign up, log in, and purchase vehicles. "Purchase" button is dynamically disabled when stock is 0.
- **Admin Dashboard**: Drawer for admins to Add, Update, and Delete vehicles, and Restock inventory.

### Backend (Spring Boot + MySQL + Spring Security)
- **RESTful Endpoints**: Dedicated routes for User Registration/Login and Vehicle/Inventory management.
- **Security & Authorization**: Spring Security 6 integration with stateless JWT authentication. Custom `@PreAuthorize` tags protect admin operations (add/update/delete/restock).
- **Data Seeding**: Automatically seeds the DB with a premium collection of 18 BMW models on first start.
- **TDD Test Suite**: 14 robust tests verifying business logic (Auth service, Vehicle purchase, restock) and Controller mock HTTP request integration.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Framer Motion, Recharts, Lucide Icons, Vanilla CSS Module stylesheets.
- **Backend**: Spring Boot 3.3.5, Java 22, JPA / Hibernate, Spring Security, JWT (jjwt).
- **Database**: MySQL 8.0
- **Build Tools**: npm, Local Apache Maven 3.9.6 installation.

---

## 🚀 Setup & Installation

### 1. Database Setup
Ensure you have MySQL running. Create the database:
```sql
CREATE DATABASE IF NOT EXISTS car_dealership;
```
The database connection string is configured in backend properties to automatically establish this database on launch if not present:
`jdbc:mysql://localhost:3306/car_dealership?createDatabaseIfNotExist=true`

### 2. Backend Setup
The backend contains a self-contained local installation of Maven 3.9.6 to build and run seamlessly:
```bash
cd CAR_DEALERSHIP_BACKEND
# Run backend application
.\maven\bin\mvn.cmd spring-boot:run
```
The server will run on `http://localhost:8080`.

### 3. Frontend Setup
Navigate into the React frontend and run it:
```bash
cd car-dealership
npm install
npm run dev
```
The SPA will run on `http://localhost:5173`.

---

## 🧪 Running Tests
To run the backend test suite (includes 14 tests: unit and integration slice tests with Spring Security mock context):
```bash
cd CAR_DEALERSHIP_BACKEND
.\maven\bin\mvn.cmd test
```

### Test Suite Report
```text
[INFO] Results:
[INFO] 
[INFO] Tests run: 14, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  01:13 min
[INFO] Finished at: 2026-07-11T12:29:55+05:30
[INFO] ------------------------------------------------------------------------
```

---

## 🤖 My AI Usage

### AI Tools Used
- **Antigravity (Claude-powered)**: Core developer assistant.
- **Gemini**: Used for brainstorming and schema modeling.

### How They Were Used
1. **Spring Boot Backend Setup**: Asking the assistant to create the initial Maven file structures and configure Spring Boot properties for local MySQL auto-creation.
2. **Spring Security 6 & JWT Config**: Prompting the AI assistant to write a secure custom authentication filter using the modern JJWT 0.12.x verification API.
3. **TDD Test Coverage**: The assistant generated unit tests for `AuthService` and `VehicleService` mock assertions, plus integration slice controllers with `MockMvc`.
4. **React Client API**: Used to design a lightweight wrapper client based on browser native `fetch` API to handle JWT authorization header intercepts cleanly.

### Reflection
Integrating AI dramatically sped up boilerplate setup (entities, JPA repository definitions, and Maven config). It allowed focusing more on business validations (stock limits, user permissions) and premium CSS styling details.
