# MLM Backend API

Multi-Level Marketing (MLM) backend built using **Node.js, Express.js, MySQL, JWT Authentication**.

This backend handles:

- User Authentication
- Referral System
- Wallet Management
- Team Tree
- KYC Verification
- Admin Controls
- Commission Distribution
- Reports & Transactions

---

# Tech Stack

- Node.js
- Express.js
- MySQL
- JWT
- bcryptjs
- Multer
- dotenv
- cors

---

# Project Setup

## 1. Clone Project

```bash
git clone <repo-url>
cd backend
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Create `.env`

Create `.env`

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=mlm_db

JWT_SECRET=your_secret_key
```

---

## 4. Create Database

Create MySQL database:

```sql
CREATE DATABASE mlm_db;
```

---

## 5. Run Server

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server runs on:

```bash
http://localhost:5000
```

---

# API Features

---

# Authentication APIs

## Register

```http
POST /api/auth/register
```

Body:

```json
{
  "name": "Yashwant",
  "email": "test@gmail.com",
  "password": "123456",
  "referred_by": "REF123"
}
```

---

## Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "test@gmail.com",
  "password": "123456"
}
```

Returns:

- JWT Token
- User Data

---

# Dashboard APIs

## Get Dashboard Stats

```http
GET /api/dashboard/stats
```

Returns:

- Wallet Balance
- Direct Team
- Total Team
- Total Transactions

---

# Team APIs

## Direct Team

```http
GET /api/team/direct
```

---

## Indirect Team

```http
GET /api/team/indirect
```

---

# Wallet APIs

## Transaction History

```http
GET /api/transactions
```

---

# KYC APIs

## Submit KYC

```http
POST /api/kyc/submit
```

Upload:

- Document Type
- Document Number
- Document Image

---

## Get My KYC

```http
GET /api/kyc/my
```

---

# Admin APIs

---

## Get All Users

```http
GET /api/admin/users
```

---

## Credit Wallet

```http
POST /api/admin/wallet-credit
```

Body:

```json
{
  "user_id": 4,
  "amount": 500
}
```

---

## Update Commission

```http
PUT /api/admin/commission
```

Body:

```json
{
  "level": 1,
  "amount": 100
}
```

---

## Get Wallet Transactions

```http
GET /api/admin/wallet-transactions
```

---

# KYC Admin APIs

## Get All KYC

```http
GET /api/kyc/all
```

---

## Approve / Reject KYC

```http
PUT /api/kyc/update-status
```

Body:

```json
{
  "kyc_id": 2,
  "status": "approved"
}
```

---

# Reports APIs

## Admin Reports

```http
GET /api/admin/reports
```

Returns:

- Wallet Summary
- Total Credit
- Total Debit
- User Reports
- Recent Transactions

---

# Database Tables

Project uses:

### users

Stores:

- user info
- referral code
- role
- wallet balance

---

### transactions

Stores:

- credits/debits
- level commissions

---

### kyc

Stores:

- document details
- approval status

---

### commissions

Stores:

- level-wise commission

---

# Authentication Flow

1. User Login
2. JWT Generated
3. Token Stored
4. Protected Routes Access

---

# Referral System

When a user registers:

- Referral code generated
- Linked to parent user
- Team tree updated

Commission distributed level-wise.

---

# Folder Structure

```bash
backend/
│
├── config/
├── controllers/
├── middleware/
├── routes/
├── uploads/
├── db.js
├── server.js
└── package.json
```

---

# Important Notes

### Upload Folder

Create:

```bash
uploads/
```

for KYC documents.

---

### MySQL Must Be Running

Before starting server.

---

# Author

**Yashwant**

MLM Full Stack MERN Developer
