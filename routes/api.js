import express from "express";
import { run } from "../chatbot/bySearch/langchainAgent.js";
// import generateResponse from "../chatbot/generate_response.js";
import generateResponse from "../chatbot/usingDocuments/generate_response.js";
import { saveSiteData } from "../chatbot/usingDocuments/document_loaders.js";
import { accessSync, constants as NodeConstants } from 'node:fs';
import { cwd } from "node:process";



const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(`
    There are two endpoints<br> 
    1. https://chat-bot-poc.vercel.app/api/query/search :  Uses search engines to create results for the Chatbot<br>
    2. https://chat-bot-poc.vercel.app/api/query/document : Uses webscraping to create results for the Chatbot<br>
    This is just the initial basic level chatbot further improvements to enhance the search skills <br>
    require paid OpenApi access instead of a free one.
  `);
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

router.post("/create/vector", async function (req, res, next) {
  const fileSaved = await saveSiteData();
  if (fileSaved) {
    return res.status(200).send("Data Stored Successfully");
  }
  else {
    return res.status(500).send("Something went wrong please check logs");
  }
});

router.get('/check/vector', async function (req, res, next) {
  try {
    accessSync(cwd() + "/vector_db/docstore.json", NodeConstants.F_OK)
    return res.send("locally available ON " + cwd());
  }
  catch (e) {
    return res.status(500).send(e);
  }
});

export default router;
