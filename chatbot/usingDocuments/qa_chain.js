import { configDotenv } from "dotenv";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import constants from "../constants.js"
configDotenv();

const ChainPrompt = constants.ChainPrompt;


export default async function chainQueries(vectorStoreRetriever) {
  const model = new ChatOpenAI({ temperature: 0.9 });
  const baseModel = new OpenAI({ temperature: 0.9 });
  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStoreRetriever,
    {
      memory: new BufferMemory({
        memoryKey: "chat_history",
        // inputKey: "question", // The key for the input to the chain
        // outputKey: "text", // The key for the final conversational output of the chain
        returnMessages: true,
      }),
      questionGeneratorChainOptions: {
        template: ChainPrompt,
        llm: baseModel
      },
      // returnSourceDocuments: true
    }
  );

  return chain;

}