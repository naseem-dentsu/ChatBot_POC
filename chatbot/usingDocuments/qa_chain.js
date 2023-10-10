import { configDotenv } from "dotenv";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import constants from "../constants.js"
configDotenv();

const ChainPrompt = constants.ChainPrompt;
const model = new OpenAI({
});

export default async function chainQueries(vectorStoreRetriever) {


  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStoreRetriever,
    {
      memory: new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
      }),
      questionGeneratorChainOptions: {
        template: ChainPrompt,
      },
    }
  );

  return chain;

}