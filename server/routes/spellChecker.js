const express = require("express");
const spellChecker = express.Router();
const axios = require("axios");
const model = require("../config/geminiModel");

spellChecker.post("/", async (req, res) => {
  const { sentence } = req.body;
  try {
     // Check if the sentence is empty
  if (!sentence || sentence.trim() === "") {
    return res.render("spellCheck", { 
      error: "Please provide a sentence." ,correctedText:"",corrections:""
    });
  }
    // Update the prompt to request corrections and corrected text
    const prompt = `You are a helpful assistant that checks and corrects spelling errors in the following text. Provide the corrected text and a list of corrections in a structured format. Only return the results as JSON with the following fields: "correctedText" (the text with corrections) and "corrections" (an array of corrections made). If no corrections are needed, include the message "No corrections needed" in the "correctedText" field and ensure the "corrections" field contains a single entry where both "original" and "corrected" fields are the same. Here's the text: ${sentence}`;




    const result = await model.generateContent(prompt);
    
    const responseText = await result.response.text();

    // Clean the response by removing any extra backticks or formatting
    const cleanedResponse = responseText.replace(/^```json\s*|\s*```$/g, '').trim();
    
    // Parse the JSON response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return res.status(500).json({ error: "Invalid JSON format" });
    }

    const { correctedText, corrections } = jsonResponse;

    res.render("spellCheck",{ correctedText, corrections,error:"" });
  } catch (error) {
    res.render("spellCheck", { 
      error: error.message 
    });
  }
});

module.exports = spellChecker;
