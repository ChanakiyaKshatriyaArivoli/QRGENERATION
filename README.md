# QR Generation Application

This project is a QR code generation and validation system built with React (frontend) and Express.js (backend). It integrates with Google Sheets for data storage and uses Nodemailer for email functionality.

## Prerequisites

- Install [Node.js](https://nodejs.org/) (LTS version recommended).
- Install npm (comes with Node.js).
- Ensure you have a Google account for app password generation.

## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd QRGeneration
```

### 2. Install Dependencies
#### Frontend
```bash
cd src/assets
npm install
```

#### Backend
```bash
cd server/
npm install
```

### 3. Run the Application
#### Frontend
```bash
npm run dev
```

#### Backend
```bash
npm run start-server
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:3000`.

## Email Configuration

To send emails using the backend, you need to configure an app password for your email account.

### Steps to Obtain an App Password
1. Log in to your email account.
2. Enable two-factor authentication (if not already enabled).
3. Navigate to the "App Passwords" section in your account settings.
4. Generate a new app password for the application.
5. Copy the generated app password.

### Configure the Backend
1. Create a `.env` file in the `backend` directory.
2. Add the following environment variables:
   ```
   EMAIL_USER=<your-email>
   EMAIL_APP_PASSWORD=<your-app-password>
   ```
3. Save the file and restart the backend server.

## Scripts

### Frontend
- `npm run dev`: Start the development server.
- `npm run build`: Build the production-ready frontend.
- `npm run preview`: Preview the production build.

### Backend
- `npm run start-server`: Start the backend server with Nodemon for live reloading.

## Features

- Generate QR codes based on user data.
- Validate QR codes during scanning.
- Send QR codes via email.
- Store and manage user data in Google Sheets.

## Troubleshooting

- Ensure both frontend and backend servers are running.
- Verify the `.env` file is correctly configured for email functionality.
- Check the console logs for detailed error messages.

## License

This project is licensed under the MIT License.
