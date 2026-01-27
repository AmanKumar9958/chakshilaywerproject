// models/Client.js
const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientType: { type: String, enum: ["Individual", "Company"], default: "Individual" },
    organization: String,
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: "India" },
    billingType: String,
    rate: Number,
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    category: String,
    
    // ✅ ADD THESE FIELDS TO SCHEMA
    totalCases: { type: Number, default: 0 },
    activeCases: { type: Number, default: 0 },
    closedCases: { type: Number, default: 0 },
    billedAmount: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 },
    lastInteraction: { type: Date, default: Date.now },
    outstandingDues: { type: Number, default: 0 },
    totalBilled: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 }
  },
  { timestamps: true, collection: "clients" }
);

module.exports = mongoose.model("Client", clientSchema);
