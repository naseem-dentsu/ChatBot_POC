import express from "express";
import { run } from "../chatbot/bySearch/langchainAgent.js";
// import generateResponse from "../chatbot/generate_response.js";
import generateResponse from "../chatbot/usingDocuments/generate_response.js";
const router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.send({ title: 'Api Page' });
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
