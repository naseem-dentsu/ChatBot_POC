import getDocument from "./document_loaders.js";
import chainQueries from "./qa_chain.js";

export default async function generateResponse(query) {

  const vectorStoreRetriever = await getDocument();

  const queryResult = await chainQueries(vectorStoreRetriever, query);
  return queryResult;
}