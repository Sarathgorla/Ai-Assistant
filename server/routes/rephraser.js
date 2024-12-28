const express = require("express");
const rephraserRouter = express.Router();
const model = require("../config/geminiModel");

rephraserRouter.post("/", async (req, res) => {
  const { sentence } = req.body;

  try {
    if (!sentence || sentence.trim() === "") {
      return res.render("spellCheck", { 
        error: "Please provide a sentence." ,correctedText:"",corrections:""
      });
    }
    const prompt = `You are a helpful assistant that rephrases sentences. Rephrase the following sentence in three different ways without providing any additional comments or context: "${sentence}"`;
    
    const result = await model.generateContent(prompt);
    const rephrasedSentences = result.response.text().split('\n').filter(sentence => sentence.trim() !== "");

    res.render("rephrase", {
      sentence,
      rephrasedSentences: rephrasedSentences.slice(0, 3),
      error: "" // No error
    });
  } catch (error) {
    console.error("Error rephrasing the sentence:", error);
    res.render("rephrase", {
      sentence,
      rephrasedSentences: [],
      error: error.message
    });
  }
});

module.exports = rephraserRouter;
