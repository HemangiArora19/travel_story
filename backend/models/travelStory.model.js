const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the travel story schema
const travelStorySchema = new Schema({
    title: { type: String, required: true },
    story: { type: String, required: true },
    visitedLocation: { type: [String], default: [] }, // corrected the typo 'vistedLocation' -> 'visitedLocation'
    isFavourite: { type: Boolean, default: false },  // corrected 'isFvourite' to 'isFavourite'
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    createdOn: { type: Date, default: Date.now },
    imageUrl: { type: String, required: true },
    visitedDate: { type: Date, required: true },
});

// Create and export the TravelStory model
module.exports = mongoose.model("TravelStory", travelStorySchema);
