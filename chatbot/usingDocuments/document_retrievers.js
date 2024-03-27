
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { accessSync, constants as NodeConstants } from 'node:fs';
import constants from "../constants.js";

const webcrawl = constants.Directories.crawled_db
/**
 * Gets the current saved index 
 * @returns false | Vector Store Retriever
 */
export async function getCrawledDocument() {
  console.log("loading data from db")
  try {
    accessSync(webcrawl + "/docstore.json", NodeConstants.F_OK)
    console.log("local db available");
    //load it from the local file
    const loadedVectorStore = await FaissStore.load(
      webcrawl,
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