const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");

const admin = require("./firebaseAdmin");// 🔥 NEW

const Subscription = require("./models/Subscription");

const app = express();

require("dotenv").config();

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

// EMAIL REMINDERS
app.post("/api/email-reminders", authMiddleware, async (req, res) => {
  try {
    const userEmail = req.body.email || req.user.email;
    const subscriptions = Array.isArray(req.body.subscriptions) ? req.body.subscriptions : [];

    console.log("📧 Email reminder request received");
    console.log("   User email:", userEmail);
    console.log("   Subscriptions count:", subscriptions.length);

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required for email reminders" });
    }

    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      !process.env.EMAIL_FROM
    ) {
      console.log("❌ SMTP config missing:");
      console.log("   SMTP_HOST:", process.env.SMTP_HOST ? "✓" : "✗");
      console.log("   SMTP_PORT:", process.env.SMTP_PORT ? "✓" : "✗");
      console.log("   SMTP_USER:", process.env.SMTP_USER ? "✓" : "✗");
      console.log("   SMTP_PASS:", process.env.SMTP_PASS ? "✓" : "✗");
      console.log("   EMAIL_FROM:", process.env.EMAIL_FROM ? "✓" : "✗");
      
      return res.status(500).json({
        message:
          "Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and EMAIL_FROM in your environment.",
      });
    }

    const dueSubscriptions = subscriptions
      .filter((sub) => sub?.nextPaymentDate)
      .map((sub) => ({
        ...sub,
        diffDays: Math.round(
          (new Date(sub.nextPaymentDate).setHours(0, 0, 0, 0) -
            new Date().setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24),
        ),
      }))
      .filter((sub) => sub.diffDays >= 0 && sub.diffDays <= 30);

    console.log("   Due subscriptions:", dueSubscriptions.length);

    const subject = dueSubscriptions.length
      ? "Upcoming subscription payment reminders"
      : "Subscription payment reminder";

    const lines = dueSubscriptions.length
      ? dueSubscriptions.map((sub) => {
          const dueDate = new Date(sub.nextPaymentDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return `• ${sub.name} is due on ${dueDate} for ${sub.cost}`;
        })
      : ["No upcoming subscription payments within the next 30 days."];

    const bodyText = [
      `Hello,`,
      "",
      "Here are your upcoming subscription reminders:",
      "",
      ...lines,
      "",
      "Thanks for using Subscription Tracker!",
    ].join("\n");

    const htmlLines = lines.map((line) => `<li>${line}</li>`).join("");
    const bodyHtml = `
      <p>Hello,</p>
      <p>Here are your upcoming subscription reminders:</p>
      <ul>${htmlLines}</ul>
      <p>Thanks for using Subscription Tracker!</p>
    `;

    console.log("🔧 Configuring Nodemailer transport...");
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("📤 Sending email to:", userEmail);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject,
      text: bodyText,
      html: bodyHtml,
    });

    console.log("✅ Email sent successfully!");
    res.json({ message: "Email reminder sent successfully!" });
  } catch (error) {
    console.error("❌ Email error:", error.message);
    console.error("   Full error:", error);
    res.status(500).json({ message: `Email error: ${error.message}` });
  }
});

// 🚀 START SERVER
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});