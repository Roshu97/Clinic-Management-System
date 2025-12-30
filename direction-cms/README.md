# Direction - Clinic Management System

## Project Description
"Direction" is a work assistance software designed to streamline communication between doctors and receptionists. It handles patient registration, token generation, and prescription management efficiently.

## Features
- **Receptionist Module:** Registers patients, assigns tokens automatically.
- **Doctor Module:** Views live waiting queue, submits prescriptions.
- **Automated Workflow:** Token status updates from "Waiting" to "Completed" upon consultation.
- **Logging:** Tracks system actions for safety and debugging.

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Logging:** Winston Logger

## Setup & Execution

### 1. Database Setup
- Install MySQL.
- Run the script inside `schema.sql` to create the database and tables.

### 2. Backend Setup
```bash
git clone <your-repo-link>
cd direction-cms
npm install
# Configure .env file with your DB credentials
npm start