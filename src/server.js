const express = require("express");
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const app = express();

// Configure multer for file handling
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Supabase client
const supabase = createClient(
  "https://mtwoqmnswxvrvpoxbcgw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10d29xbW5zd3h2cnZwb3hiY2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0Mzc1MjcsImV4cCI6MjA1ODAxMzUyN30.dwTLWaQvoB7XMhv-Jepo8GaS1RkCXcQgVNLlQoMuAiY" // Replace with your Supabase anon key
);

// API endpoint to handle file upload
app.post("/api/upload", upload.single("audioFile"), async (req, res) => {
  console.log("File received:", req.file); // Log the uploaded file
  console.log("Request body:", req.body); // Log the request body

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const file = req.file;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from("audio-files") // Replace with your Supabase bucket name
      .upload(`audios/${Date.now()}_${file.originalname}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("Error uploading to Supabase:", error);
      return res
        .status(500)
        .json({ message: "Failed to upload file to cloud." });
    }

    // Get the public URL of the uploaded file
    const { publicUrl } = supabase.storage
      .from("audio-files")
      .getPublicUrl(data.path);

    // Save the URL to the database (example with Supabase)
    const { error: dbError } = await supabase
      .from("songs")
      .insert([{ name: file.originalname, audio: publicUrl }]);

    if (dbError) {
      console.error("Error saving URL to database:", dbError);
      return res
        .status(500)
        .json({ message: "Failed to save file URL to database." });
    }

    res
      .status(200)
      .json({ message: "File uploaded successfully!", url: publicUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "An error occurred during upload." });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
