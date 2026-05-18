# GoalSphere AI 🚀

## Intelligent Goal Setting & Performance Tracking Platform

GoalSphere AI is a modern enterprise-grade Goal Setting & Performance Tracking Portal built for organizations to streamline employee goal creation, approvals, quarterly progress tracking, and performance visibility.

The platform solves the limitations of spreadsheets and manual review processes by providing structured workflows, real-time tracking, auditability, analytics dashboards, and role-based collaboration.

Designed for **AtomQuest Hackathon 1.0**, GoalSphere AI combines enterprise workflow management with modern UI, analytics, and interactive experiences.

---

# ✨ Features

## 🔐 Authentication & Security

- JWT Authentication
- Spring Security Integration
- Role-Based Access Control
- BCrypt Password Encryption
- Protected Routes
- Session Validation
- Demo Login Support

---

## 👨‍💼 Employee Module

Employees can:

- Create goals
- Draft and edit goals
- Define:
  - Goal title
  - Description
  - Thrust Area
  - Unit of Measurement
  - Targets
  - Weightage
- Submit goals
- View approval status
- Update quarterly achievements
- Track progress
- View manager comments
- Receive notifications

Validation Rules:

- Total goal weightage = 100%
- Minimum individual goal weightage = 10%
- Maximum goals = 8

---

## 👨‍💻 Manager Module

Managers can:

- View team goals
- Review submissions
- Edit target/weightage during review
- Approve goals
- Return goals for rework
- Conduct quarterly check-ins
- Add comments
- Monitor team progress
- Assign shared goals

---

## 👨‍🏫 Admin Module

Admin/HR can:

- Manage users
- Configure goal cycles
- Unlock approved goals
- View reports
- Monitor completion rates
- View audit trails
- Manage organization hierarchy
- Access analytics dashboard

---

# 📊 Analytics & AI Features

- Goal completion tracking
- Team performance dashboard
- Department progress analytics
- AI-generated insights
- Goal distribution analysis
- Completion trends
- KPI visualizations
- Interactive charts

Example AI Insights:

> "Q2 performance dropped by 15%"

> "3 employees risk missing goals"

> "Manager approval delays increased"

---

# 🌐 Interactive UI Features

- Glassmorphism design
- Responsive layouts
- Animated KPI cards
- Interactive dashboards
- Framer Motion transitions
- 3D progress visualization
- Modern enterprise UI
- Dark/Light support

---

# 🧠 3D Experience

Built using:

- React Three Fiber
- Drei

Features:

- Rotating performance orb
- Organizational network visualization
- Interactive node effects
- Smooth animations

---

# 🏗 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- ShadCN UI
- Framer Motion
- React Three Fiber
- Drei
- Recharts

---

## Backend

- Spring Boot
- Spring Security
- JWT Authentication
- REST APIs

---

## Database

- MySQL

---

## DevOps

- Docker
- Docker Compose

---

# 📂 Project Structure

```text
GoalSphere/
│
├── frontend/                           # React + Vite frontend
│   │
│   ├── public/                         # Static assets
│   │
│   ├── src/
│   │   │
│   │   ├── assets/                     # Images, icons, logos
│   │   │
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── Navbar/
│   │   │   ├── Sidebar/
│   │   │   ├── KPIWidgets/
│   │   │   ├── GoalCards/
│   │   │   ├── Charts/
│   │   │   ├── Notifications/
│   │   │   └── ThreeD/
│   │   │
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   ├── EmployeeDashboard/
│   │   │   ├── GoalCreation/
│   │   │   ├── MyGoals/
│   │   │   ├── QuarterUpdates/
│   │   │   ├── ManagerDashboard/
│   │   │   ├── Approvals/
│   │   │   ├── TeamGoals/
│   │   │   ├── AdminDashboard/
│   │   │   ├── Reports/
│   │   │   ├── AuditLogs/
│   │   │   └── Analytics/
│   │   │
│   │   ├── services/                   # API calls
│   │   │   ├── authService.js
│   │   │   ├── goalService.js
│   │   │   ├── userService.js
│   │   │   └── analyticsService.js
│   │   │
│   │   ├── context/                    # Global state management
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── routes/                     # Protected routes
│   │   │   ├── AppRoutes.jsx
│   │   │   └── PrivateRoute.jsx
│   │   │
│   │   ├── utils/                      # Utility functions
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
│
├── backend/                            # Spring Boot backend
│   │
│   ├── src/main/java/com/goalsphere/
│   │   │
│   │   ├── controller/                 # REST APIs
│   │   │   ├── AuthController.java
│   │   │   ├── GoalController.java
│   │   │   ├── ManagerController.java
│   │   │   ├── AdminController.java
│   │   │   └── AnalyticsController.java
│   │   │
│   │   ├── service/                    # Business logic
│   │   │   ├── AuthService.java
│   │   │   ├── GoalService.java
│   │   │   ├── CheckInService.java
│   │   │   ├── NotificationService.java
│   │   │   ├── AuditService.java
│   │   │   └── InsightService.java
│   │   │
│   │   ├── repository/                 # Database repositories
│   │   │   ├── UserRepository.java
│   │   │   ├── GoalRepository.java
│   │   │   ├── CheckInRepository.java
│   │   │   └── AuditRepository.java
│   │   │
│   │   ├── entity/                     # JPA entities
│   │   │   ├── User.java
│   │   │   ├── Goal.java
│   │   │   ├── CheckIn.java
│   │   │   ├── SharedGoal.java
│   │   │   ├── AuditLog.java
│   │   │   └── GoalCycle.java
│   │   │
│   │   ├── security/
│   │   │   ├── JwtService.java
│   │   │   ├── JwtFilter.java
│   │   │   ├── SecurityConfig.java
│   │   │   └── CustomUserDetailsService.java
│   │   │
│   │   ├── config/
│   │   │   ├── CorsConfig.java
│   │   │   └── DataSeeder.java
│   │   │
│   │   └── GoalSphereApplication.java
│   │
│   │
│   └── src/main/resources/
│       ├── application.yml
│       └── data.sql
│
│
├── database/
│   ├── schema.sql
│   ├── sample-data.sql
│   └── migration.sql
│
│
├── docs/
│   ├── architecture-diagram.png
│   ├── workflow-diagram.png
│   └── walkthrough.md
│
│
├── docker-compose.yml
├── .gitignore
├── README.md
└── LICENSE
```

## Structure Overview

### Frontend
Contains all user interfaces, dashboards, components, animations, and API integrations.

### Backend
Contains authentication, REST APIs, business logic, database entities, and security.

### Database
Contains SQL schema and sample data.

### Docs
Contains architecture diagrams, workflows, and project documentation.

### Docker
Used for containerized database and deployment setup.
---

# 🗄 Database Schema

Core entities:

- User
- Goal
- CheckIn
- SharedGoal
- AuditLog
- Notification
- GoalCycle

Relationship Flow:

```text
Admin

↓

Manager

↓

Employee

↓

Goals

↓

Quarter Updates

↓

Reports
```

---

# 🔑 Demo Credentials

### Employee

Email:

```text
employee@goalsphere.com
```

Password:

```text
Demo123
```

---

### Manager

Email:

```text
manager@goalsphere.com
```

Password:

```text
Demo123
```

---

### Admin

Email:

```text
admin@goalsphere.com
```

Password:

```text
Demo123
```

---

# ⚙ Database Setup

Start MySQL and create database:

```sql
CREATE DATABASE goalsphere;
```

Configure:

backend/src/main/resources/application.yml

```yaml
spring:
 datasource:
   url: jdbc:mysql://localhost:3306/goalsphere?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   username: root
   password: root

 jpa:
   hibernate:
      ddl-auto: update
```

---

# 🚀 Run Locally

## Step 1: Start Database

```bash
docker-compose up -d
```

---

## Step 2: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Step 3: Start Backend

Open backend project:

IntelliJ / Eclipse

Run:

```text
BackendApplication.java
```

Backend:

```text
http://localhost:8080
```

---

# 🔌 API Modules

Authentication

- Login
- Register
- JWT Validation

Goals

- Create Goal
- Update Goal
- Submit Goal

Manager

- Team Dashboard
- Approvals
- Check-ins

Admin

- Cycle Management
- Reports
- Unlock Goals
- Analytics

---

# 📈 Future Enhancements

- Microsoft Entra SSO
- Teams Integration
- Email Notifications
- Escalation Engine
- Advanced AI Recommendations
- Predictive Analytics

---

# 🎯 Hackathon Focus

GoalSphere AI was designed to satisfy:

✅ Complete workflow functionality  
✅ BRD compliance  
✅ User friendliness  
✅ Modern enterprise UI  
✅ Reporting & auditability  
✅ Role-based access  
✅ Cost optimization

---

# 👨‍💻 Developed For

AtomQuest Hackathon 1.0

GoalSphere AI — Intelligent Goal Setting & Performance Tracking Platform
