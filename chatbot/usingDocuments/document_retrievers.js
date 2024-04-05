
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { accessSync, constants as NodeConstants } from 'node:fs';

/**
 * 
 * Gets the current saved index 
 * @param {string} directory 
 * @returns false | Vector Store Retriever
 */
export async function getCrawledDocument(directory) {
  console.log("loading data from db" + directory)
  try {
    accessSync(directory + "/docstore.json", NodeConstants.F_OK)
    console.log("local db available");
    //load it from the local file
    const loadedVectorStore = await FaissStore.load(
      directory,
      new OpenAIEmbeddings({ maxConcurrency: 1, maxRetries: 1, modelName: "text-embedding-3-small" })
    );

    console.log("fetched db");

    return loadedVectorStore.asRetriever();
  }
  catch (e) {
    console.log(e)
    return false
  }

}