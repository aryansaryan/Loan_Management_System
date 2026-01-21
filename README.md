# LOAN MANAGEMENT SYSTEM – Full-Stack Loan Processing Platform

The **Loan Management System** is a production-ready full-stack web application designed to manage the complete loan lifecycle for financial organizations.

The platform allows **customers to submit loan applications**, **analysts to review and approve requests**, and **administrators to manage users and system activity**. All workflows are secured using **JWT authentication and role-based authorization**.

This project demonstrates practical software engineering skills including scalable backend design, secure authentication, cloud deployment, and a modern responsive frontend.

---

## Live Demo

Frontend:  
Backend API:  

### Demo Credentials

| Role     | Username | Password   |
|----------|-----------|------------|
| Admin    | admin     | admin123   |
| Analyst  | analyst   | analyst123 |
| Customer | aryan     | abcde      |

Demo data may reset periodically.

---

## Business Value

- Automates loan application processing  
- Reduces manual review overhead  
- Improves transparency and auditability  
- Enforces secure access control  
- Designed for scalability and cloud deployment  

---

## Core Features

### Security and Authentication

- Stateless JWT authentication  
- Role-based access control (ADMIN, ANALYST, CUSTOMER)  
- BCrypt password encryption  
- Secure REST APIs using Spring Security  
- Configured CORS protection  

### Customer Portal

- Submit new loan applications  
- Track application status in real time  
- View application history  

### Analyst Dashboard

- Review incoming loan applications  
- Approve or reject requests  
- Filter and paginate loan records  
- Live status updates  

### Admin Console

- View system metrics  
- Manage users and roles  
- Activate or deactivate accounts  
- Monitor platform usage  

### UI and Experience

- Responsive Material UI layout  
- Clean dashboard design  
- Animated loading states  
- Mobile-friendly interface  

---

## Technology Stack

### Frontend

- React (TypeScript)  
- Material UI  
- Axios  
- React Router   

### Backend

- Java 17  
- Spring Boot  
- Spring Security  
- JWT authentication  
- REST APIs  
- Hibernate / JPA  
- Docker  

### Database

- PostgreSQL (Supabase)  

### DevOps

- GitHub  
- Containerization  
- CI/CD pipelines  

---

## Architecture Overview

```
[ React Frontend]
            |
            v
[ Spring Boot API]
            |
            v
[ PostgreSQL Database]
```

---

## Screenshots

```
screenshots/
 ├─ LoginPage.png
 ├─ AdminDashboard.png
 ├─ AnalystDashboard.png
 ├─ Loans.png
 └─ LoanApplication.png
 ├─ CustomertDashboard.png
 ├─ SignupPage.png
 └─ HomePage.png
```

Example usage:

```
![Admin Dashboard](screenshots/admin-dashboard.png)
```

---

## Project Structure

```
loan-management-system/
 ├── backend/        Spring Boot backend
 ├── frontend/       React frontend
 ├── .gitignore
 ├── README.md
```

---

## Local Development Setup

### Prerequisites

- Java 17 or higher  
- Node.js 18 or higher  
- Maven  
- PostgreSQL or Supabase  
- Git  

---

### Backend Setup

```
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs at:

```
http://localhost:8080
```

---

### Frontend Setup

```
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

### Environment Variables (Backend Example)

```
spring.datasource.url=jdbc:postgresql://localhost:5432/loanmanagementsystem
spring.datasource.username=postgres
spring.datasource.password=postgres

jwt.secret=your_secure_secret_key
```

Do not commit real credentials to the repository.

---

## API Reference (Sample)

### Authentication

```
POST /api/auth/login
POST /api/auth/register
```

### Loans

```
POST   /api/loans/apply
GET    /api/loans
PATCH  /api/loans/{id}/approve
PATCH  /api/loans/{id}/reject
```

### Administration

```
GET  /api/admin/metrics
GET  /api/admin/users
PUT  /api/admin/users/{id}/role
PUT  /api/admin/users/{id}/active
```

---


## Planned Enhancements

- Deployement
- Analytics dashboard  
- Email notifications  
- Audit logging  
- Document uploads  
- Automated CI/CD pipelines  
- Role hierarchy improvements  

---

## Author

**Aryan Sudhagoni**  
Master’s in Computer Science  
Software Developer  

Email: aryansaryan15@gmail.com  
LinkedIn: https://www.linkedin.com/in/aryansudhagoni/  
GitHub: https://github.com/aryansaryan  

---

## Support

If you find this project useful, feel free to star the repository or reach out.
