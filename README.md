# VentureAI

VentureAI is a comprehensive startup idea validation platform and AI Pitch Deck Generator. It enables entrepreneurs to evaluate their startup concepts through data-driven analysis and automatically generate investor-ready pitch decks, empowering them to make informed decisions about their projects.

## Features

- **Idea Validation**: Processes startup concepts to evaluate market demand, assess competitors, identify target user demographics, and propose revenue models.
- **AI Pitch Deck Generator**: Automatically creates an investor-ready 12-slide presentation based on the validated idea.
- **Reporting & Analytics**: Generates detailed validation reports with visual data representations (using Recharts).
- **History Management**: Stores previous validation reports and allows users to manage and safely delete them.
- **Authentication**: Seamless sign-up and login functionality with Google Authentication.
- **PDF Export**: Allows exporting generated pitch decks directly to PDF formats.

## Tech Stack

### Frontend
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4
- **Routing**: React Router DOM 7
- **Authentication**: `@react-oauth/google`
- **Charts/Visualization**: Recharts
- **Icons**: Lucide React
- **Export Utilities**: `html2canvas`, `jspdf`, `html-to-image`

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Google Auth Library, JSON Web Tokens (JWT), bcryptjs
- **Environment Management**: dotenv

## Folder Structure

```text
VentureAI/
├── backend/
│   ├── index.js          # Main Express server and API routes
│   ├── package.json      # Backend dependencies
│   └── .env              # Backend environment variables
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── assets/       # Images and other assets (e.g., logo.png)
│   │   ├── pages/        # React components for pages
│   │   │   ├── Compare.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NewIdea.jsx
│   │   │   ├── PitchDeck.jsx
│   │   │   ├── ReportDetails.jsx
│   │   │   └── Signup.jsx
│   │   ├── App.jsx       # Main application layout and routing
│   │   ├── App.css       # Global styles (Tailwind utilities, custom CSS)
│   │   └── main.jsx      # Vite entry point
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.js    # Vite configuration
│   └── .env              # Frontend environment variables
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB account/cluster
- Google Cloud Console account (for Google OAuth credentials)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VentureAI
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory and add your environment variables:
     ```env
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     GOOGLE_CLIENT_ID=your_google_client_id
     JWT_SECRET=your_jwt_secret
     ```
   - Start the backend server:
     ```bash
     npm start
     ```
     *(Use `npm run dev` if you have configured nodemon)*

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```
   - Create a `.env` file in the `frontend` directory for frontend environment variables:
     ```env
     VITE_API_URL=http://localhost:5000
     VITE_GOOGLE_CLIENT_ID=your_google_client_id
     ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

## Deployment

The platform is configured for production deployment (e.g., using Render).
- Ensure that the frontend `.env` points the `VITE_API_URL` to your live backend domain instead of localhost.
- Configure environment variables on your hosting provider to ensure secure access to MongoDB and Google OAuth.
