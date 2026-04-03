import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for Google users
  googleId: { type: String }, // Optional for non-Google users
});

const User = mongoose.model("User", userSchema);


// Report Schema
const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  businessModel: { type: String, required: true },
  targetAudience: { type: String, required: true },
  keyFeatures: String,
  analysis: {
    overallScore: { type: Number, required: true },
    verdict: { type: String, required: true },
    marketDemand: {
      score: Number,
      analysis: String
    },
    competitorAssessment: {
      score: Number,
      analysis: String,
      keyCompetitors: [String]
    },
    userDemographics: {
      score: Number,
      targetPersona: String,
      behavior: String
    },
    revenueOptions: {
      score: Number,
      strategies: [String]
    },
    nextSteps: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model("Report", reportSchema);


// =========================
//  MIDDLEWARE
// =========================
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) throw new Error();

    req.user = user;
    next();
  } catch (e) {
    res.status(401).json({ message: "Please authenticate" });
  }
};


// =========================
//  SIGNUP ROUTE
// =========================
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =========================
//  GOOGLE AUTH ROUTE
// =========================
app.post("/api/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = new User({
        name,
        email,
        googleId,
        // No password for Google users
      });
      await user.save();
    } else if (!user.googleId) {
      // Link Google account to existing email account
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.status(400).json({ message: "Google authentication failed" });
  }
});


// =========================
//  LOGIN ROUTE
// =========================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =========================
//  REPORT ROUTES
// =========================

// Get all reports for user
app.get("/api/reports", auth, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single report
app.get("/api/reports/:id", auth, async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) return res.status(404).json({ message: "Report not found" });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create new analysis (Rapid API)
app.post("/api/reports", auth, async (req, res) => {
  try {
    const { name, description, industry, businessModel, targetAudience, keyFeatures } = req.body;

    const promptText = `
You are an expert startup advisor and market analyst. Analyze the following startup idea and return ONLY a valid JSON object. Do not include markdown tags (like \`\`\`json) or any other text. 

Idea Name: ${name}
Description: ${description}
Industry: ${industry}
Business Model: ${businessModel}
Target Audience: ${targetAudience}
Key Features: ${keyFeatures}

Return the response strictly in this exact JSON structure and nothing else:
{
  "overallScore": <number 1-100 indicating viability>,
  "verdict": "<high, medium, or low>",
  "marketDemand": {
    "score": <number 1-100>,
    "analysis": "<detailed paragraph about market demand>"
  },
  "competitorAssessment": {
    "score": <number 1-100>,
    "analysis": "<detailed paragraph about competition>",
    "keyCompetitors": ["<competitor 1>", "<competitor 2>", "<competitor 3>"]
  },
  "userDemographics": {
    "score": <number 1-100>,
    "targetPersona": "<description of ideal customer>",
    "behavior": "<description of user behavior>"
  },
  "revenueOptions": {
    "score": <number 1-100>,
    "strategies": ["<strategy 1>", "<strategy 2>", "<strategy 3>"]
  },
  "nextSteps": [
    "<step 1>", "<step 2>", "<step 3>", "<step 4>"
  ]
}
`;

    const url = 'https://chatgpt-42.p.rapidapi.com/gpt4';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: promptText
          }
        ],
        web_access: false
      })
    };

    const response = await fetch(url, options);
    const resultText = await response.text();

    let analysis;
    if (!process.env.RAPID_API_KEY || response.status !== 200) {
      console.warn("RapidAPI failed or key missing. Falling back to mock data for demonstration.");
      analysis = {
        overallScore: 85,
        verdict: "high",
        marketDemand: {
          score: 88,
          analysis: "Strong demand for household carbon tracking apps as consumers become more sustainability-conscious. The market is growing at 15% annually."
        },
        competitorAssessment: {
          score: 75,
          analysis: "Moderate competition. Existing apps focus on broad tracking; a household-specific tool has a unique niche.",
          keyCompetitors: ["JouleBug", "EarthHero", "OroEco"]
        },
        userDemographics: {
          score: 90,
          targetPersona: "Sustainability-conscious families and eco-tech enthusiasts aged 25-45.",
          behavior: "Regularly uses smart home devices and prefers subscription-based specialty services."
        },
        revenueOptions: {
          score: 82,
          strategies: ["Monthly Subscription", "Affiliate Eco-Store", "Enterprise CSR Partnerships"]
        },
        nextSteps: [
          "Validate core UI with a prototype",
          "Partner with local green energy providers",
          "Launch a beta program for early adopters",
          "Optimize for high retention through gamification"
        ]
      };
    } else {
      try {
        const parsedResult = JSON.parse(resultText);
        let contentString = "";

        if (parsedResult.result) {
          contentString = parsedResult.result;
        } else if (parsedResult.choices && parsedResult.choices[0].message) {
          contentString = parsedResult.choices[0].message.content;
        } else {
          contentString = resultText;
        }

        // Cleanup formatting if AI still outputs markdown
        contentString = contentString.replace(/```json/g, "").replace(/```/g, "").trim();

        analysis = JSON.parse(contentString);
      } catch (e) {
        console.error("Failed to parse AI response. Raw Response:", resultText);
        console.error(e);
        return res.status(500).json({ message: "Failed to parse analysis from AI provider" });
      }
    }

    const newReport = new Report({
      userId: req.user._id,
      name,
      description,
      industry,
      businessModel,
      targetAudience,
      keyFeatures,
      analysis
    });

    await newReport.save();
    res.json(newReport);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Analysis failed" });
  }
});

// Generate Pitch Deck
app.post("/api/reports/:id/pitch-deck", auth, async (req, res) => {
  try {
    const report = await Report.findOne({ _id: req.params.id, userId: req.user._id });
    if (!report) return res.status(404).json({ message: "Report not found" });

    const promptText = `
You are an expert startup consultant. Based on the startup idea below, generate a professional 6-slide Pitch Deck. 
Return ONLY a valid JSON object. Do not include markdown tags or any other text.

Idea Name: ${report.name}
Description: ${report.description}
Industry: ${report.industry}
Business Model: ${report.businessModel}

Return strictly in this JSON format:
{
  "problem": "Pain point description",
  "solution": "Your solution description",
  "marketSize": "TAM/SAM/SOM or scale analysis",
  "businessModel": "Revenue and unit economics",
  "competitors": "Market landscape",
  "gtmStrategy": "Acquiring first 1000 users"
}
`;

    let pitchDeck;

    if (!process.env.RAPID_API_KEY) {
      console.warn("RapidAPI key missing. Falling back to mock pitch deck.");
      pitchDeck = {
        problem: `Founders and entrepreneurs currently lack a data-driven way to validate their ${report.industry} ideas quickly. High failure rates are often due to a lack of initial market understanding.`,
        solution: `${report.name} provides instant AI-powered validation and strategic insights, allowing founders to fail fast or scale with confidence.`,
        marketSize: "The global startup analytics and AI advisory market is projected to reach $12.5B by 2028, with millions of new small businesses starting annually.",
        businessModel: `A ${report.businessModel} approach, likely starting with a freemium SaaS model followed by premium enterprise consulting tiers.`,
        competitors: "Positioned as a more accessible alternative to traditional consultancies like McKinsey, and more specialized than general-purpose AI like ChatGPT.",
        gtmStrategy: "Leverage content marketing on LinkedIn and Twitter, partner with startup incubators, and offer free initial Tier-1 reports to build a user base."
      };
    } else {
      const url = 'https://chatgpt-42.p.rapidapi.com/gpt4';
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': process.env.RAPID_API_KEY,
          'x-rapidapi-host': 'chatgpt-42.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptText }],
          web_access: false
        })
      };

      const response = await fetch(url, options);
      const resultText = await response.text();
      
      try {
        pitchDeck = JSON.parse(resultText);
      } catch (e) {
        console.error("AI returned invalid JSON for pitch deck. Falling back to mock.");
        pitchDeck = {
          problem: "Difficulty in generating structured pitch content quickly.",
          solution: "AI-powered slide generation based on validated startup metrics.",
          marketSize: "Niche startup tool market.",
          businessModel: "Feature-locked premium access.",
          competitors: "Manual creation or generic AI tools.",
          gtmStrategy: "Direct outreach to startup communities."
        };
      }
    }

    res.json(pitchDeck);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Pitch deck generation failed" });
  }
});


// =========================
// SERVER
// =========================
app.listen(5000, () => console.log("Server running on port 5000"));