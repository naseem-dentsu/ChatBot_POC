import { getCrawledDocument } from "./document_retrievers.js";
import chainQueries from "./qa_chain.js";


const vectorStoreRetriever = await getCrawledDocument();
if (vectorStoreRetriever === false) {
  console.error("Vector Store retriever not working")
}
const chain = await chainQueries(vectorStoreRetriever);

/**
 * Create a streamed response by bot to emulated thinking 
 * requires chat history and current querry
*/
export default async function generateResponse(query, chat_history = "") {

  const stream = await chain.stream({
    question: query,
    chatHistory: chat_history
  });

  return stream;
}