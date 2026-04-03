import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

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
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);


// Report Schema
const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  description: String,
  industry: String,
  businessModel: String,
  targetAudience: String,
  keyFeatures: String,
  analysis: {
    overallScore: Number,
    verdict: String,
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


// =========================
// SERVER
// =========================
app.listen(5000, () => console.log("Server running on port 5000"));