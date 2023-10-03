import getDocument from "./chatbot/document_loaders.js";
import chainQueries from "./chatbot/qa_chain.js";



//remove this when deploying to production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const vectorStoreRetriever = await getDocument();

const queryResult = await chainQueries(vectorStoreRetriever, "compare both Laptop Bags");

console.log(queryResult);