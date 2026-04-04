# VentureAI 🚀

<p align="center">
  <em>From Idea to Investor-Ready in 60 Seconds.</em>
</p>

VentureAI is a comprehensive, advanced AI startup idea validation platform and pitch deck generator designed for entrepreneurs, builders, and dreamers. Built with the MERN stack and styled for a premium SaaS aesthetic, VentureAI allows you to evaluate your startup concepts through data-driven analysis and automatically generate stunning, investor-ready pitch decks.

## ✨ Features

- **Idea Validation AI**: Leverages ChatGPT-42 RapidAPI to generate high-fidelity reports assessing market demand, competitor landscape, target user demographics, and revenue models.
- **Risk Analysis & Idea Improvement AI**: Actionable risk assessments and contextual feature suggestions to pivot and improve weak points in the idea.
- **AI Pitch Deck Generator**: Automatically creates an investor-ready 12-slide presentation based on the validated idea.
- **Reporting & Analytics**: Generates detailed validation reports with visual data representations using Recharts (Radar Charts, etc).
- **History Management**: Stores previous validation reports and allows users to manage and revisit them.
- **Authentication System**: Secure, self-hosted JWT (email/password) & Google OAuth flows for session management and private dashboards.
- **PDF Export**: Allows exporting generated pitch decks directly to PDF formats with perfect layout alignment.
- **High-Fidelity SaaS UI**: Premium light-themed aesthetic with Tailwind CSS 4, refined typography, and subtle micro-animations.

## 🛠 Tech Stack

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
- **AI Engine**: RapidAPI (ChatGPT-42 API)

## 🗺 Application Routes

### Frontend Routes
- `/` - Landing Page overview and call to action.
- `/login` - Secure user login (Email/Password or Google Auth).
- `/signup` - New founder registration.
- `/dashboard` - Main control center summarizing validated ideas.
- `/new-idea` - Input details to run a new AI validation.
- `/reports/:id` - Detailed view of specific validation reports and charts.
- `/history` - Revisit and manage all previously analyzed ideas.
- `/compare` - Side-by-side comparison of different startup ideas.
- `/pitch-deck` - The generated 12-slide investor pitch presentation.

### Backend Endpoints
**Authentication:**
- `POST /api/signup` - Register a new account.
- `POST /api/login` - Login and generate a session token.
- `POST /api/auth/google` - Secure token exchange for Google Sign-in.

**Reports & AI Generation (Requires Auth Token):**
- `GET /api/reports` - Fetch all saved validation reports for the user.
- `GET /api/reports/:id` - Retrieve a comprehensive specific report.
- `POST /api/reports` - Generate a new idea analysis via AI provider.
- `POST /api/reports/:id/pitch-deck` - Generate a Pitch Deck tailored to the report.

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
- RapidAPI Key (For ChatGPT-42)

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
     RAPID_API_KEY=your_rapidapi_chatgpt_42_key
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

The platform is configured for production deployment (e.g., using Render or Vercel).
- Ensure that the frontend `.env` points the `VITE_API_URL` to your live backend domain instead of localhost.
- Configure environment variables on your hosting provider to ensure secure access to MongoDB, Google OAuth, and RapidAPI.
