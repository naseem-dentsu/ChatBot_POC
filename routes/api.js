import express from "express";
import { run } from "../custom/langchainAgent.js";
// import generateResponse from "../chatbot/generate_response.js";
const router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Api Page' });
});

router.get('/get/response', async function (req, res, next) {
  // const query = req.body.query;
  // if (!query) {
  //   return res.render("error", {
  //     message: "No query Found",
  //     error: {
  //       status: 401,
  //       stack: ""
  //     }
  //   })
  // }
  // else {

  const data = await run("can you suggest me moisturizers?");
  res.status(200).send(data);
  // }
});

export default router;
