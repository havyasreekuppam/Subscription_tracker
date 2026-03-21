const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    name: String,
    cost: Number,
    billingCycle: String,
    nextBillingDate: Date,
    category: String,
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);