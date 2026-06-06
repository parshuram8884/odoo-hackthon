# VendorBridge - Procurement ERP Platform

VendorBridge is a full-stack, responsive procurement ERP portal designed to connect corporate Procurement Managers (Admins) and Vendors. It streamlines the lifecycle of procurement—from drafting Request for Quotations (RFQs), bidding, issuing Purchase Orders (POs), to raising and paying billing Invoices.

---

## 🚀 Key Features

* **Strict Role-Based UI Separation**: Completely separate interfaces, workflows, and pages for Managers and Vendors.
* **RFQ Lifecycle**: Managers can draft and publish RFQs. Vendors browse open RFQs and submit quotes.
* **Bidding & PO Issuance**: Managers review bids, approve them, and the system automatically generates binding Purchase Orders.
* **Invoicing**: Vendors raise invoices against issued POs. Managers track and mark invoices as Paid.
* **PDF Invoice Exports**: Built-in client-side professional PDF generation for all billing invoices.
* **MongoDB Atlas Integration**: Relational schema modeling via Mongoose, with database-level indexes and auto-seeding.

---

## 🛠️ Technology Stack

* **Frontend**: React (v19), Vite, TailwindCSS (v4), Axios, jsPDF, React Icons, React Router DOM
* **Backend**: Node.js, Express, MongoDB Atlas, Mongoose (ODM), JWT (Authentication), BcryptJS (Encryption)

---

## ⚙️ Environment Configuration

Set up environment variables to connect the client and server.

### 1. Server Configuration (`server/.env`)
Create a `.env` file in the `server/` directory and configure the following:
```env
PORT=5000

# Connection string for MongoDB Atlas
MONGO_URI="mongodb+srv://mohitparshuramthakur234_db_user:hOhjAz2wUAsjGVMV@cluster0.9fzqe14.mongodb.net/?appName=Cluster0"

# Secret key used for signing JWT tokens
JWT_SECRET="your_secure_jwt_secret_key"
```

### 2. Client Configuration (`client/.env` - Optional)
Vite automatically defaults to `http://localhost:5000/api` if no variable is specified. To override, create a `.env` file in the `client/` directory:
```env
VITE_API_URL="http://localhost:5000/api"
```

---

## 🚦 Getting Started

### Prerequisites
* **Node.js** (v18+)
* **NPM** (v10+)
* A running **MongoDB Atlas** database cluster (or local MongoDB community server)

### Step 1: Clone and install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 2: Running the Server
From the `server/` directory, launch the API backend:
```bash
# To run in production mode
npm start

# To run with nodemon hot-reloading (development)
npm run dev
```
*The server automatically boots up on [http://localhost:5000](http://localhost:5000) and seeds default accounts into the database if the collections are empty.*

### Step 3: Running the Client
From the `client/` directory, run the Vite development server:
```bash
npm run dev
```
*The client app will launch on [http://localhost:5173](http://localhost:5173).*

---

## 👤 Seeding & Credentials

On initial boot, the database is auto-seeded with the following credentials (password is `••••••••` unless updated):

| Email Address | Role / View | Description |
| :--- | :--- | :--- |
| `admin@vendorbridge.com` | **Admin / Manager** | Full access to create/publish RFQs, approve quotations, issue POs, and authorize invoice payments. |
| `vendor@vendorbridge.com` | **Vendor** | Browses published RFQs, submits quotes, views POs, raises invoices, and downloads billing PDFs. |

---

## 📂 Architecture Overview

```
vendor-bridge/
├── client/
│   ├── src/
│   │   ├── components/       # Layout parts (Sidebar, Header)
│   │   ├── context/          # AppContext global state and operations wrapper
│   │   ├── pages/            # Role-separated pages (Manager vs. Vendor views)
│   │   │   ├── ManagerRfqList.jsx / VendorRfqList.jsx
│   │   │   ├── ManagerQuotationList.jsx / VendorQuotationList.jsx
│   │   │   ├── ManagerPoList.jsx / VendorPoList.jsx
│   │   │   └── ManagerInvoiceList.jsx / VendorInvoiceList.jsx
│   │   ├── services/         # API layer configuration
│   │   └── utils/            # pdfGenerator.js (jsPDF builder)
├── server/
│   ├── models/               # Mongoose MongoDB collections modeling
│   ├── routes/               # Express routing tables
│   ├── controllers/          # Route controller request Handlers
│   ├── services/             # Core database transaction logic
│   └── middleware/           # authMiddleware (JWT validation)
```
