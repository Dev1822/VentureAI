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

// Create new analysis (Mock AI)
app.post("/api/reports", auth, async (req, res) => {
  try {
    const { name, description, industry, businessModel, targetAudience, keyFeatures } = req.body;

    // Simulate AI Processing Delay
    // In a real app, this is where you'd call OpenAI/Gemini
    const generateAnalysis = (data) => {
      const score = Math.floor(Math.random() * 40) + 50; // Random score between 50-90
      const verdict = score > 75 ? "high" : score > 60 ? "medium" : "low";

      return {
        overallScore: score,
        verdict,
        marketDemand: {
          score: Math.floor(Math.random() * 30) + 60,
          analysis: `The ${data.industry} market is currently experiencing significant tailwinds. Given the focus on ${data.targetAudience}, there is a clear gap in the market for a solution that emphasizes ${data.keyFeatures || 'ease of use'}.`
        },
        competitorAssessment: {
          score: Math.floor(Math.random() * 40) + 50,
          analysis: `While there are established players in the ${data.industry} space, few target ${data.targetAudience} specifically with a ${data.businessModel} approach. Your competitive advantage lies in the integration of specialized features.`,
          keyCompetitors: ["Incumbent A", "Startup B", "Traditional Methods"]
        },
        userDemographics: {
          score: Math.floor(Math.random() * 30) + 65,
          targetPersona: data.targetAudience,
          behavior: "Highly engaged with digital solutions, looking for efficiency and value-driven experiences."
        },
        revenueOptions: {
          score: Math.floor(Math.random() * 25) + 70,
          strategies: [
            `${data.businessModel}`,
            "Tiered Subscription",
            "Data Analytics Add-on"
          ]
        },
        nextSteps: [
          "Validate core value proposition with a landing page MVP.",
          "Conduct 10 user interviews with the target demographic.",
          "Refine the pricing model based on early feedback.",
          "Develop a low-fidelity prototype of key features."
        ]
      };
    };

    const analysis = generateAnalysis(req.body);

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