import getDocument from "./document_loaders.js";
import chainQueries from "./qa_chain.js";


const vectorStoreRetriever = await getDocument();

const chain = await chainQueries(vectorStoreRetriever);

export default async function generateResponse(query, chat_history = "") {
  const res = await chain.call({
    question: query,
    chat_history
  });

  return res;
}