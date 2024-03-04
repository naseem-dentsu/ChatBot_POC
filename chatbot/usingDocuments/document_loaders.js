import { compile } from "html-to-text";
import { MultiVectorRetriever } from "langchain/retrievers/multi_vector";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { accessSync, constants as NodeConstants } from 'node:fs';
import constants from "../constants.js"
import { configDotenv } from "dotenv";
import { cwd } from "node:process";
configDotenv();


const urls = constants.urls;

/* Create instance for embedding */
const embeddings = new OpenAIEmbeddings();
const directory = cwd() + "/vector_db";
const directoryOld = cwd() + "/vector_db_old";


export async function saveSiteData() {
  try {
    const compiledConvert = compile({ wordwrap: 130 }); // returns (text: string) => string;

    //load word document
    const loader = new RecursiveUrlLoader(urls[0], {
      extractor: compiledConvert,
      maxDepth: 4,
      // excludeDirs: ["https://js.langchain.com/docs/api/"],
    });

    const data = await loader.load();

    //split document in different chunks
    const splitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await splitter.splitDocuments(data);

    const OpenAI_VectorStore = await FaissStore.fromDocuments(
      docs,
      embeddings
    );
    //store the file 
    await OpenAI_VectorStore.save(directory);
    return true;
  }
  catch (e) {
    console.log(e);
    return false;
  }
}

export async function getDocument() {
  console.log("loading data from db")
  var isDBAvailable = false;
  var fileSaved = false;
  try {
    accessSync(cwd() + "/vector_db/docstore.json", NodeConstants.F_OK)
    isDBAvailable = true;
    fileSaved = true;
    console.log("local db available");
  }
  catch (e) {
    isDBAvailable = false;
  }
  if (!isDBAvailable) {
    console.log("local db doesnt exist, creating db this may take some time...")
    fileSaved = await saveSiteData();
  }

  if (fileSaved) {
    //load it from the local file
    const loadedVectorStore = await FaissStore.load(
      directory,
      new OpenAIEmbeddings()
    );

    console.log("fetched db");

    return loadedVectorStore.asRetriever();
  }

  else {
    return false
  }


}


export default getDocument;