import getDocument from "./document_loaders.js";
import chainQueries from "./qa_chain.js";

export default async function generateResponse(query) {

  const vectorStoreRetriever = await getDocument();

  const chain = await chainQueries(vectorStoreRetriever);

  const res = await chain.call({
    question: query,
  });

  return res;
}