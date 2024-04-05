import { getCrawledDocument } from "./document_retrievers.js";
import chainQueries from "./qa_chain.js";
import constants from "../constants.js";


const siteDataRetriever = await getCrawledDocument(constants.Directories.crawled_db);
const textDataRetriever = await getCrawledDocument(constants.Directories.text_db);

if (siteDataRetriever === false) {
  console.error("Site Store retriever not working")
}
if (textDataRetriever === false) {
  console.error("Text Store retriever not working")
}
const siteChain = await chainQueries(siteDataRetriever);
const textChain = await chainQueries(textDataRetriever);


/**
 * Create a streamed response by bot to emulated thinking 
 * requires chat history and current querry
*/
export async function generateResponseFromSiteData(query, chat_history = "") {

  const stream = await siteChain.stream({
    question: query,
    chatHistory: chat_history
  });

  return stream;
}

export async function generateResponseFromTextData(query, chat_history = "") {

  const stream = await textChain.stream({
    question: query,
    chatHistory: chat_history
  });

  return stream;
}