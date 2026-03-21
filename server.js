const Subscription = require("./models/Subscription");
const express=require("express");
const mongoose=require("mongoose");
const app=express();
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/subscriptionDB").then(()=>console.log("MondoDB is connected")).catch(err=>console.log(err));
app.get("/",(req,res)=>{
    res.send("Server is running");
}
);
app.get("/api/subscriptions", async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/subscriptions/:id", async (req, res) => {
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
app.post("/api/subscriptions", async (req, res) => {
    try {
        const { name, cost, billingCycle, nextBillingDate, category } = req.body;

        const newSubscription = new Subscription({
            name,
            cost,
            billingCycle,
            nextBillingDate,
            category
        });

        const savedData = await newSubscription.save();

        res.status(201).json(savedData);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.put("/api/subscriptions/:id", async (req, res) => {
    try {
        const updatedSub = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // returns updated data
        );

        if (!updatedSub) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        res.status(200).json(updatedSub);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
app.delete("/api/subscriptions/:id", async (req, res) => {
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