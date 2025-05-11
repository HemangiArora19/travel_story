const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema
const userSchema = new Schema({
  fullName: { type: String, required: true }, // Changed to 'fullName' for consistency
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdOn: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model("User", userSchema);
