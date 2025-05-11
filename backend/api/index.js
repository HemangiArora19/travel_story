require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const User = require("../models/user.models");
const { authenticateToken } = require("../utilities");
const travel = require("../models/travelStory.model");
const fs= require("fs")
const path= require("path")

const upload= require("../multer");
const { error } = require("console");
// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));




mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validate input
  if (!fullName || !email || !password) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  // Check if user already exists
  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.status(400).json({ error: true, message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
    );
    return res.status(201).json({
      error: false,
      user: { fullName: user.fullName, email: user.email },
      accessToken,
      message: "Registered successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: true, message: "Error saving user" });
  }
});
//login api done
app.post("/login",async(req,res)=>{
  const {email,password}=req.body;
  if(!email|| !password){
    return res.status(400).json({message:"Email and password are requires"});
  }
  const user= await User.findOne({email});
  if(!user){
    return res.status(400).json({meassage:"User not found"});
  }
  const isPasswordValid= await bcrypt.compare(password,user.password);
  if(!isPasswordValid){
    return res.status(400).json({meassage:"Invalid credentails"});
  }
  const accessToken= jwt.sign(
    { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "72h" }
  );
   return res.json({
    error:false,
    message:"Login is sucessful",
    user:{fullName:user.fullName,email:user.email},
    accessToken,

   });
});
//get User
app.get("/get-user",  authenticateToken,async(req,res)=>{
  const {userId}=req.user
  const isUser= await User.findOne({_id:userId});
  if(!isUser){
    return res.sendStatus(401);
  } 
  return res.json({
    user:isUser,
    meassage:""
  });
});
//add story route
app.post("/add-travel-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // Check if all required fields are provided
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res.status(400).json({
      error: true,
      message: "All fields are required"
    });
  }

  // Parse visitedDate
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    // Create the new travel story object
    const travelStory = new travel({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });

    // Save the travel story to the database
    await travelStory.save();

    // Return success response
    res.status(201).json({
      story: travelStory,
      message: "Added successfully"
    });

  } catch (error) {
    // Return error response in case of failure
    res.status(500).json({
      error: true,
      message: error.message
    });
  }
});
// get all story
app.get("/get-all-stories", authenticateToken, async (req, res) => {
  const {userId}= req.user;
  try{
    const travelStories = await travel.find({userId:userId}).sort({
      isFavourite:-1,
    });
    res.status(200).json({stories:travelStories});
  } catch (error){
    res.status(500).json({error:true,message:error.message});
  }
});


app.post("/edit-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params; // Trim whitespace/newlines
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: true, message: "Invalid ID format" });
  }

  // Validate required fields
  if (!title || !visitedLocation || !imageUrl || !visitedDate) {
    return res.status(400).json({ error: true, message: "All fields are required" });
  }

  try {
    console.log("Requested ID:", id);
    console.log("User ID from token:", userId);

    // Use findByIdAndUpdate for simplicity
    const updatedStory = await travel.findByIdAndUpdate(
      id,
      {
        title,
        story: story || undefined,
        visitedLocation,
        imageUrl,
        visitedDate: new Date(parseInt(visitedDate)),
      },
      { new: true } // Return the updated document
    );

    if (!updatedStory) {
      console.log(updatedStory);
      return res.status(404).json({ error: true, message: "Travel story not found" });
      
    }

    res.status(200).json({ story: updatedStory, message: "Update was successful" });
  } catch (error) {
    console.error("Error updating travel story:", error.message);
    res.status(500).json({ error: true, message: error.message });
  }
});
// delete story
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  let { id } = req.params;
  const { userId } = req.user;

  try {
    // Find the travel story by ID and ensure it belongs to the authenticated user
    const travelStory = await travel.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }

    // Delete the travel story from the database
    await travel.deleteOne({ _id: id, userId: userId });

    // Extract the filename from the imageUrl
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    // Define the file path
    const filePath = path.join(__dirname, "uploads", filename);

    // Optional: Delete the file from the server (if required)
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err.message);
      }
    });

    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
});


//image
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: true, message: "No image uploaded" });
    }
    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    res.status(200).json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});
//delete image
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;

  // Check if the imageUrl query parameter is provided
  if (!imageUrl) {
    return res.status(400).json({ error: true, message: "imageUrl parameter is required" });
  }

  try {
    const fileName = path.basename(imageUrl); // Extract the filename
    const filePath = path.join(__dirname, 'uploads', fileName); // Build the full path

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file
      console.log("File deletion is done for image:", fileName);
      return res.status(200).json({ message: "Image deleted successfully" });
    } else {
      return res.status(404).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: true, message: error.message });
  }
});
//update edit issfavousite
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    // Find the travel story by ID and ensure it belongs to the authenticated user
    const travelStory = await travel.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }

    // Update the isFavourite field
    travelStory.isFavourite = isFavourite;

    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});
//seach
app.get("/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    return res
      .status(404)
      .json({ error: true, message: "query is required" });
  }

  try {
    const searchResults = await travel.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});
//filter the serch
app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
      // Convert startDate and endDate from milliseconds to Date objects
      const start = new Date(parseInt(startDate));
      const end = new Date(parseInt(endDate));

      // Find travel stories that belong to the authenticated user and fall within the date range
      const filteredStories = await travel.find({
          userId: userId,
          visitedDate: { $gte: start, $lte: end },
      }).sort({ isFavourite: -1 });

      res.status(200).json({ stories: filteredStories });
  } catch (error) {
      res.status(500).json({ error: true, message: error.message });
  }
});

app.use("/uploads",express.static(path.join(__dirname,"uploads")));
app.use("/assets",express.static(path.join(__dirname,"assests")));

// Start the server
const PORT = process.env.PORT|| 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export for testing or further usage

module.exports.handler = serverless(app);

