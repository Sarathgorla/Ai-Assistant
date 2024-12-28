


const express = require("express");
const contentGenerator = express.Router();
const model = require("../config/geminiModel"); // Assuming geminiModel handles Gemini AI API interaction
const multer = require("multer");

// Set up multer for in-memory file storage with size limits
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set a reasonable size limit (5MB)
});
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"), // Convert buffer to base64
      mimeType,
    },
  };
}
contentGenerator.post("/", upload.single('image'), async (req, res) => {
  // Validate request body (prompt might be required)
  const {prompt}=req.body;

  const imageFile = req.file;

  // Check if the prompt is provided
  if (!prompt) {
    return res.render("contentGenerator",{
      
      initialPrompt:prompt,
     generatedContent:"",
     error:"Prompt is required" 
 
    });
  }

  // Initialize data array with the prompt
  let data = [prompt];

  // If an image file is uploaded, process it into the required format
  if (imageFile) {
    const imageBuffer = imageFile.buffer;
    const imageMimeType = imageFile.mimetype;

    // Ensure the file is a valid image
    if (!imageMimeType.startsWith("image/")) {
      return res.render("contentGenerator",{
      
        initialPrompt:prompt,
       generatedContent:"",
       error:"Only image files are allowed"
   
      });
    }

    // Convert the image to the base64 inline data required by Google Generative AI
    const imagePart = fileToGenerativePart(imageBuffer, imageMimeType);
    data.push(imagePart); // Add the image part to the data array
  }

  // Send the prompt (and optional image) to the Generative AI model
  try {
    const generatedContentResponse = await model.generateContent(data);
    // Extract the generated text from candidates
    const candidates = generatedContentResponse.response.candidates;

    
      const generatedText = candidates[0]?.content?.parts[0]?.text || "No text generated";
   
   // console.log(prompt,generatedText)
    res.render("contentGenerator",{
      
      initialPrompt:prompt,
     generatedContent:generatedText,
     error:""
 
    });
  } catch (error) {
    res.render("contentGenerator",{
     initialPrompt:prompt,
      generatedContent:"",
      error:error.message
    });
  }
});
module.exports = contentGenerator;

