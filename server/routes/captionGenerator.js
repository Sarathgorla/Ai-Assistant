const express = require("express");
const captionGenerator = express.Router();
const multer = require("multer");
const geminiModel = require("../config/geminiModel");

// Set up multer for in-memory file storage with size limits
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Set a reasonable size limit (5MB)
});

// Function to convert image buffer to base64 inline data format
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"), // Convert buffer to base64
      mimeType,
    },
  };
}

captionGenerator.post("/", upload.single('image'), async (req, res) => {
  try {
    // Add prompt for generating 8 captions
    const captionPrompt = "Generate creative and engaging captions for the following image. The captions should be diverse, appealing, and suitable for social media posts. Each caption should highlight the visual aspects of the image in a fun, interesting, or artistic way. Please provide the captions in a numbered list format.";

    const image = req.file; // Get image uploaded by user

    // Ensure an image file is uploaded
    if (!image) {
      return res.render('captionGenerator', { 
        generatedCaptions: null,
        image: "",
        error: "Image is required" 
      });
    }

    // Validate image file type
    const imageMimeType = image.mimetype;
    if (!imageMimeType.startsWith("image/")) {
      return res.render('captionGenerator', { 
        generatedCaptions: null,
        image: "",
        error: "Only image files are allowed" 
      });
    }

    const imagePart = fileToGenerativePart(image.buffer, imageMimeType);

    // Prepare data for the Gemini AI model
    const data = [captionPrompt, imagePart];

    // Call the model to generate captions
    const captionsResponse = await geminiModel.generateContent(data); 
    // Extract the generated text from candidates
    const candidates = captionsResponse.response.candidates;

    const generatedCaptionsText = candidates[0]?.content?.parts[0]?.text || "No captions generated";
    const generatedCaptions = generatedCaptionsText.split("\n").filter(caption => caption.trim() !== '');

    // Render the captions in the view
    res.render('captionGenerator', { 
      generatedCaptions,
      image: `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`,
      error: null 
    });
  } catch (error) {
    // In case of any unexpected errors
    res.render('captionGenerator', { 
      generatedCaptions: null,
      image: "",
      error: 'Failed to generate captions' 
    });
  }
});

module.exports = captionGenerator;
