import { configDotenv } from "dotenv";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import constants from "../constants.js"
configDotenv();

const ChainPrompt = constants.ChainPrompt;
const baseModel = new OpenAI({ temperature: 0.9 });

export default async function chainQueries(vectorStoreRetriever) {

  const chain = ConversationalRetrievalQAChain.fromLLM(
    baseModel,
    vectorStoreRetriever,
    {
      questionGeneratorChainOptions: {
        llm: baseModel
      },
      // returnSourceDocuments: true
      qaChainOptions: {
        type: "map_reduce",
        prompt: ChainPrompt
      }
    }
  );

  return chain;

}