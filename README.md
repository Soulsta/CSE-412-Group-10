# CSE-412-Group-10
ASU Sporting Ticket System — A web app for students to claim and manage tickets for ASU sporting events. Built with React, Express.js, and PostgreSQL. CSE 412 Spring 2026.

## Team Members
- Owen Hymers
- Arnav Babel
- Angel Palacios
- Jade Aragon

## Tech Stack
- **Frontend:** React.js
- **Backend:** Express.js / Node.js
- **Database:** PostgreSQL

## Course Info
CSE 412 — Database Management | Arizona State University | Spring 2026

# Instructions for running the program locally:
## Prerequisites
Make sure you have the following installed before running the project:
- [Node.js](https://nodejs.org/) (v20.17.0 or higher)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/CSE-412-Group-10.git
cd CSE-412-Group-10
```

### 2. Set Up the Database
Open a terminal and run:
```bash
psql -U postgres -d mydb -f database/schema.sql
```
> If the database `mydb` does not exist yet, create it first:
> ```bash
> psql -U postgres -c "CREATE DATABASE mydb;"
> ```

### 3. Configure Environment Variables
Inside the `backend/` folder, create a `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mydb
DB_USER=postgres
DB_PASSWORD=yourpassword
PORT=3001
```
Replace `yourpassword` with your actual PostgreSQL password.

### 4. Install Backend Dependencies
```bash
cd backend
npm install
```

### 5. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## Running the Project

You will need **two terminals** open at the same time.

### Terminal 1 — Start the Backend
```bash
cd backend
node server.js
```
You should see: `Server running on port 3001`

### Terminal 2 — Start the Frontend
```bash
cd frontend
npm run dev
```
Then open your browser and go to: `http://localhost:5173`

---

## Troubleshooting

**psql is not recognized**
> Add PostgreSQL to your system PATH. See [this guide](https://www.postgresql.org/docs/current/install-windows.html).

**Port 3001 already in use**
> Change the `PORT` value in `backend/.env` to another port (e.g. 3002).

**npm install fails**
> Make sure your Node.js version is v20.17.0 or higher. Run `node --version` to check.
