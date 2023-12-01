import { configDotenv } from "dotenv";
import constants from "../constants.js";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { RunnableSequence } from "langchain/schema/runnable";
import { StringOutputParser } from "langchain/schema/output_parser";
import { formatDocumentsAsString } from "langchain/util/document";

configDotenv();

const ChainPrompt = constants.ChainPrompt;
const baseModel = new ChatOpenAI({
  temperature: 0.9, callbacks: [
    {
      handleLLMEnd: (output) => {
        console.log(output); // tokenUsage is empty
      },
    },
  ],
});

const questionPrompt = PromptTemplate.fromTemplate(
  ChainPrompt
);

export default async function chainQueries(vectorStoreRetriever) {

  const chain = RunnableSequence.from([
    {
      question: (input) =>
        input.question,
      chatHistory: (input) =>
        input.chatHistory ?? "",
      context: async (input) => {
        const relevantDocs = await vectorStoreRetriever.getRelevantDocuments(input.question);
        const serialized = formatDocumentsAsString(relevantDocs);
        console.log(serialized);
        return serialized;
      },
    },
    questionPrompt,
    baseModel,
    new StringOutputParser(),
  ]);

  return chain;

}