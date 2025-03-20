import supabase from "../supabase"; // Import Supabase client
import { v4 as uuidv4 } from "uuid"; // For generating unique file names

async function testUpload() {
  const file = new File(["Hello, world!"], "test.txt", { type: "text/plain" });

  try {
    console.log("Starting upload...");
    const { data, error } = await supabase.storage
      .from("uploads") // Replace with your Supabase bucket name
      .upload(`${uuidv4()}.txt`, file);

    if (error) {
      console.error("Error uploading file:", error);
    } else {
      console.log("File uploaded successfully:", data);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

// Call the function to test
testUpload();
