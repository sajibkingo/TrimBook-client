
# ✨ TrimBook — Salon & Spa Appointment Booking Platform

**TrimBook** is a modern, full-stack salon and spa appointment booking platform designed to make beauty and wellness services easier to discover, book, and manage.

Customers can explore services, schedule appointments, track booking status, and make secure online payments. Administrators can manage services, appointments, users, and transactions through a dedicated dashboard.

---

## 🌟 Key Features

### 👤 Customer Features

- **Authentication:** Register and sign in using email/password or Google OAuth.
- **Browse Services:** Explore available salon and spa services.
- **Search & Filter:** Find services using search, filtering, and sorting options.
- **Appointment Booking:** Select preferred appointment dates and time slots.
- **Booking Management:** View appointment history and track booking status.
- **Appointment Cancellation:** Cancel pending appointments.
- **Secure Payments:** Pay for confirmed appointments through Stripe Checkout.
- **Payment Receipts:** View payment details after successful payment.
- **Profile Management:** Update personal information and upload profile pictures.

### 🛠️ Admin Features

- **Admin Dashboard:** View key platform statistics and activity.
- **Service Management:** Add, edit, and delete salon and spa services.
- **Appointment Management:** Review booking requests and update appointment statuses.
- **User Management:** View users, manage roles, and block or unblock accounts.
- **Transaction Management:** Review payment transactions.
- **Role-Based Access:** Restrict administrative functionality to authorized users.

### 🎨 UI & Experience

- Modern and responsive interface.
- Elegant dark-themed design with warm gold and rose accents.
- Clean dashboard layouts.
- Toast notifications for important actions.
- Reusable UI components and consistent design patterns.

---

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| Frontend | Next.js, React.js |
| Styling | Tailwind CSS, shadcn/ui |
| Icons | Lucide React |
| Notifications | React-Toastify |
| Backend | Node.js, Express.js |
| Database | MongoDB Native Driver |
| Authentication | Better Auth |
| Payment Gateway | Stripe |
| Image Hosting | ImgBB |
| Other Tools | CORS, dotenv |

---

## 🏗️ Project Structure

```text
TrimBook/
│
├── trimbook-client/
│   ├── app/
│   │   ├── sign-in/
│   │   ├── sign-up/
│   │   └── dashboard/
│   │       ├── add-service/
│   │       ├── edit-service/
│   │       ├── manage-appointments/
│   │       ├── manage-services/
│   │       ├── manage-users/
│   │       ├── my-appointments/
│   │       ├── payment-success/
│   │       └── profile/
│   ├── components/
│   ├── lib/
│   └── ...
│
└── trimbook-server/
    ├── middleware/
    │   ├── verifyToken.js
    │   └── verifyAdmin.js
    ├── routes/
    ├── index.js
    └── ...
```

---

## ⚙️ Getting Started

Follow these instructions to run TrimBook locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/kingo-sks/trimbook.git
```

### 2. Navigate to the Project

```bash
cd trimbook
```

### 3. Setup the Backend

Navigate to the backend directory and install dependencies:

```bash
cd trimbook-server
npm install
```

Create a `.env` file in the `trimbook-server` directory:

```env
PORT=5000
CLIENT_URL=
MONGODB_URI=
STRIPE_SECRET_KEY=
```

Start the backend development server:

```bash
npm run dev
```

### 4. Setup the Frontend

Open another terminal and navigate to the frontend directory:

```bash
cd trimbook/trimbook-client
npm install
```

Create a `.env.local` file in the `trimbook-client` directory:

```env
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_IMGBB_API_KEY=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

MONGODB_URI=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Start the frontend development server:

```bash
npm run dev
```

### 5. Open the Application

| Application | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |

> **Note:** Never commit your actual environment variable values, API keys, database credentials, or secrets to GitHub.

---

## 🔐 Authentication & Security

TrimBook uses **Better Auth** for authentication, supporting:

- Email and password authentication.
- Google OAuth authentication.
- Session-based authentication.
- Secure session cookies.
- Bearer token verification.

The backend includes authentication and authorization middleware:

- `verifyToken.js` — Verifies authenticated requests using supported session cookies or bearer tokens.
- `verifyAdmin.js` — Restricts administrative operations to authorized administrators.

Role-based access control helps protect sensitive dashboard features and API endpoints.

---

## 💳 Appointment & Payment Workflow

The platform follows a structured appointment process:

1. Customers browse available services.
2. Customers select a preferred date and time.
3. Customers submit an appointment request.
4. Administrators review and update the appointment status.
5. Customers can proceed to payment once an appointment is confirmed.
6. Stripe Checkout handles the payment process.
7. The application verifies the Stripe checkout session and displays the payment result.

---

## 🔗 API Endpoints

### Authentication & Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/auth/me` | Get authenticated user information |
| PATCH | `/api/users/profile` | Update user profile |

### Services

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/services` | Get all services |
| GET | `/api/services/:id` | Get a single service |
| GET | `/api/services/admin/all` | Get all services for admin |
| POST | `/api/services` | Create a service |
| PATCH | `/api/services/:id` | Update a service |
| DELETE | `/api/services/:id` | Delete a service |

### Appointments

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/appointments` | Create an appointment |
| GET | `/api/appointments/my` | Get customer appointments |
| PATCH | `/api/appointments/:id/cancel` | Cancel an appointment |
| GET | `/api/appointments/admin/all` | Get all appointments |
| PATCH | `/api/appointments/admin/:id/status` | Update appointment status |

### User Management

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/admin/all` | Get all users |
| PATCH | `/api/users/admin/:id/role` | Update user role |
| PATCH | `/api/users/admin/:id/block` | Block or unblock a user |

### Payments & Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/payments/create-checkout-session` | Create Stripe Checkout session |
| GET/POST | `/api/payments/verify-session` | Verify payment session |
| GET | `/api/transactions/admin/all` | Get all transactions |

---

## 📱 Responsive Design

TrimBook is designed to provide a consistent experience across different screen sizes and devices, including:

- Desktop computers
- Laptops
- Tablets
- Mobile devices

---


## 🚀 Future Improvements

- Real-time appointment availability.
- Advanced booking conflict prevention.
- Email and booking confirmation notifications.
- Customer reviews and ratings.
- Wishlist and favorite services.
- Advanced analytics for administrators.
- More payment options.

---

## 👨‍💻 Author

**Sajib Kumar Saha**

Computer Science & Engineering Graduate | Full-Stack Web Development Enthusiast

- **GitHub:** [@sajibkingo](https://github.com/sajibkingo)

---

## 📂 Project Repositories

- **Client Repository:** [TrimBook Client](https://github.com/kingo-sks/trimbook-client)
- **Server Repository:** [TrimBook Server](https://github.com/kingo-sks/trimbook-server)

---

<p align="center">
  ⭐ If you find this project useful, consider giving it a star!
</p>
