const express = require("express");
const cors = require("cors");
require("dotenv").config();
const rephraserRouter = require("./routes/rephraser");
const grammarCheck = require("./routes/grammarChecker");
const spellChecker = require("./routes/spellChecker");
const contentGenerator = require("./routes/contentGenerator");
const captionGenerator = require("./routes/captionGenerator");
const path = require('path');
const app = express();
const port = process.env.PORT;
//AIzaSyAeq4SX9DSW4aYByoRPGObnTutu439ejqg
//config cors
app.use(cors());

app.use(express.json()); //for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// routes for rendering the pages
app.get('/', (req, res) => {
  res.render("index");
});
// Route for displaying the form and handling spell check
app.get('/api/spellcheck', (req, res) => {
  res.render('spellCheck', { correctedText:"",corrections:[],error:"" ,SpellCheck:false});
});
// Route for displaying the form and grammar check 
app.get('/api/grammarcheck', (req, res) => {
  res.render('grammarCheck', { correctedText:"",corrections:[],error:"" ,GrammarCheck:false});
});
// Route for displaying the form and rephrase
app.get('/api/rephrase', (req, res) => {
  res.render('rephrase', {sentence:"", correctedText:"",rephrasedSentences:[],error:"" ,Rephrase:false});
});

// Route for displaying the form and content generator
app.get('/api/contentGenerator', (req, res) => {
  res.render('contentGenerator', {
    initialPrompt: '', // Initial value for the textarea prompt
    generatedContent: '', // Content to display after generation
    error: '', // Any error messages to display
    ContentGeneration: false 
  });
});

// Route for displaying the form and caption generator
app.get('/api/captionGenerator', (req, res) => {
  res.render('captionGenerator', {
     generatedCaptions:"",
     image:"",
      error: ""
  });
});

//routes
app.use("/api/rephrase", rephraserRouter);
app.use("/api/grammarcheck", grammarCheck);
app.use("/api/spellcheck", spellChecker);
app.use("/api/contentGenerator", contentGenerator);
app.use("/api/captionGenerator", captionGenerator);
//start server
app.listen(port, () => {
  console.log(`AI Writing app listening at http://localhost:${port}`);
});