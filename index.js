import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { configDotenv } from "dotenv";

configDotenv()


//remove this when deploying to production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const llm = new OpenAI({
  temperature: 0.9,
});

const chatModel = new ChatOpenAI();

const text = "What would be a good company name for a company that makes colorful socks?";

const llmResult = await llm.predict(text);
/*
  "Feetful of Fun"
*/

const chatModelResult = await chatModel.predict(text);
/*
  "Socks O'Color"
*/
console.log("llmResult", llmResult);
console.log("chatModelResult", chatModelResult);
