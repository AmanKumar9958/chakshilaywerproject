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
    category: String
  },
  { timestamps: true, collection: "clients" }
);

// ✅ Correct export (Model)
module.exports = mongoose.model("Client", clientSchema);
