import express from "express";
import { run } from "../chatbot/bySearch/langchainAgent.js";
// import generateResponse from "../chatbot/generate_response.js";
import generateResponse from "../chatbot/usingDocuments/generate_response.js";
const router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({
    "readme": `
  
  Node js version should be above 16

  This is an express app that lets us connect to the Chatbot using langchain framework
  
  Please use npm run start to start the server on PORT 3000
  Please ask for env file with @naseem-dentsu or @aditi-kharche
  
  There are two endpoints 
  1. https://chat-bot-poc.vercel.app/api/query/search :  Uses search engines to create results for the Chatbot
  2. https://chat-bot-poc.vercel.app/api/query/document : Uses webscraping to create results for the Chatbot
  
  This is just the initial basic level chatbot further improvements to enhance the search skills 
  require paid OpenApi access instead of a free one.
   
  `});
});

//Using search results
router.post('/query/search', async function (req, res, next) {
  const query = req.body.query;
  if (!query) {
    return res.render("error", {
      message: "No query Found",
      error: {
        status: 401,
        stack: ""
      }
    })
  }
  else {
    const data = await run(query);
    res.status(200).send(data);
  }
});

//using web scrapper
router.post('/query/document', async function (req, res, next) {
  const query = req.body.query;
  if (!query) {
    return res.render("error", {
      message: "No query Found",
      error: {
        status: 401,
        stack: ""
      }
    })
  }
  else {
    const data = await generateResponse(query);
    res.status(200).send(data);
  }
});

export default router;
