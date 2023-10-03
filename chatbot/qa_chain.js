import { configDotenv } from "dotenv";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";
configDotenv();

export default async function chainQueries(vectorStoreRetriever, query) {
  const llm = new OpenAI({
    temperature: 0.9,
  });

  const chain = RetrievalQAChain.fromLLM(llm, vectorStoreRetriever);
  const res = await chain.call({
    query: query,
  });

  return res;

}