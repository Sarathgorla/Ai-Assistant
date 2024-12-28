const { GoogleGenerativeAI } = require("@google/generative-ai");
  // Initialize Google Generative AI client

// Make sure to include these imports:
// import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
module.exports = model;