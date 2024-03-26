
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { accessSync, constants as NodeConstants } from 'node:fs';
import { workingDirectory } from "../constants"
const webcrawl = workingDirectory + "/crawled_db";

export async function getDocument() {
  console.log("loading data from db")
  var fileSaved = false;
  try {
    accessSync(webcrawl + "/docstore.json", NodeConstants.F_OK)
    isDBAvailable = true;
    fileSaved = true;
    console.log("local db available");
  }
  catch (e) {
    isDBAvailable = false;
  }


  if (fileSaved) {
    //load it from the local file
    const loadedVectorStore = await FaissStore.load(
      webcrawl,
      new OpenAIEmbeddings()
    );

    console.log("fetched db");

    return loadedVectorStore.asRetriever();
  }

  else {
    return false
  }


}