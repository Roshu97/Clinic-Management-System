# Direction CMS - Backend

This is the backend for the Clinic Management System, built with Node.js, Express, and MongoDB.

## Features
- **API Endpoints:** Role-based access for Admins, Doctors, Pharmacists, and Receptionists.
- **Database:** MongoDB (via Mongoose) for patient records, staff accounts, and inventory.
- **Security:** Integrated authentication and role-based permissions.
- **Reporting:** Daily financial reports and revenue stats for admin visualization.

## Setup

1. **Environment Variables**
   Create a `.env` file in this directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/clinic_cms
   ```

2. **Installation**
   ```bash
   npm install
   ```

3. **Run the Server**
   ```bash
   npm start
   ```

## Project Structure
- `models/`: Mongoose schemas for Patient, User, and Medicine.
- `routes/`: Express routes for all API endpoints.
- `utils/`: Utility functions like the Winston logger.
- `server.js`: The main entry point for the Express application.

For full project documentation and a user manual, please refer to the [Root README](../readme.md).
