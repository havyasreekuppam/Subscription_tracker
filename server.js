const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Subscription = require("./models/Subscription");
const User = require("./models/User");

const app = express();
app.use(express.json());

const JWT_SECRET = "secret123";


mongoose
  .connect("mongodb://127.0.0.1:27017/subscriptionDB")
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.send("Server is running");
});


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};




app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

 
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});




app.get("/api/subscriptions", authMiddleware, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user.userId,
    });

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.get("/api/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.post("/api/subscriptions", authMiddleware, async (req, res) => {
  try {
    const { name, cost, billingCycle, nextBillingDate, category } = req.body;

    const newSubscription = new Subscription({
      name,
      cost,
      billingCycle,
      nextBillingDate,
      category,
      userId: req.user.userId, 
    });

    const savedData = await newSubscription.save();

    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.put("/api/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    const updatedSub = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedSub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json(updatedSub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.delete("/api/subscriptions/:id", authMiddleware, async (req, res) => {
  try {
    const deletedSub = await Subscription.findByIdAndDelete(req.params.id);

    if (!deletedSub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});