const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const admin = require("./firebaseAdmin");// 🔥 NEW

const Subscription = require("./models/Subscription");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ DB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/subscriptionDB")
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

//
// 🔐 FIREBASE AUTH MIDDLEWARE
//
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    // 🔥 Verify Firebase token
    const decoded = await admin.auth().verifyIdToken(token);

    req.user = decoded; // contains uid, email
    next();

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

//
// ================= SUBSCRIPTION ROUTES =================
//

// GET all
app.get("/api/subscriptions", authMiddleware, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user.uid, // 🔥 CHANGED
    });

    res.json(subscriptions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE
app.post("/api/subscriptions", authMiddleware, async (req, res) => {
  try {
    const { name, cost } = req.body;

    const newSub = new Subscription({
      name,
      cost,
      billingCycle: "monthly",
      nextBillingDate: new Date(),
      category: "General",
      userId: req.user.uid, // 🔥 CHANGED
    });

    const saved = await newSub.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
app.delete("/api/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    await Subscription.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid, // 🔥 CHANGED
    });

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🚀 START SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});