const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
    name: String,
    cost: Number,
    billingCycle: String,
    nextBillingDate: Date,
    category: String
});

module.exports = mongoose.model("Subscription", subscriptionSchema);