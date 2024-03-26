import { compile } from "html-to-text";
import { RecursiveUrlLoader } from "langchain/document_loaders/web/recursive_url";
import constants from "../constants.js"
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import {
  JSONLoader,
  JSONLinesLoader,
} from "langchain/document_loaders/fs/json";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CSVLoader } from "langchain/document_loaders/fs/csv";
import { configDotenv } from "dotenv";
configDotenv();

const urls = constants.urls;
const cwd = constants.workingDirectory;

/* Create instance for embedding */
const embeddings = new OpenAIEmbeddings({ maxConcurrency: 1, maxRetries: 1, modelName: "text-embedding-3-small" });


/**
 * Crawls a given website and resuts data 
 * currently set to depth of 4 to prevent rate limiters 
 *  */
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
      chunkSize: 1500,
      chunkOverlap: 200,
    });

    const docs = await splitter.splitDocuments(data);
    const vectorAllStore = [];
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

    for (let i = 0; i < docs.length; i++) {
      await delay(20000)
      const currstore = await FaissStore.fromDocuments(
        docs.slice(i, i + 200),
        embeddings,
      );
      i += 200;
      vectorAllStore.push(currstore);
    }

    const OpenAI_VectorStore = vectorAllStore[0];

    for (let i = 1; i < vectorAllStore.length; i++) {
      (await OpenAI_VectorStore).mergeFrom(vectorAllStore[i])
    }

    //store the file 
    await OpenAI_VectorStore.save(directory);
    return true;
  }
  catch (e) {
    console.log(e);
    return false;
  }
}

/**
 * Loads different types of files in a provided directory 
 * useful for getting data from multiple sources
 *  */
export async function saveDocuments() {
  try {
    const loader = new DirectoryLoader(
      cwd + "/documents",
      {
        ".json": (path) => new JSONLoader(path, "/texts"),
        ".jsonl": (path) => new JSONLinesLoader(path, "/html"),
        ".txt": (path) => new TextLoader(path),
        ".csv": (path) => new CSVLoader(path, "text"),
      }
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
      new OpenAIEmbeddings({ maxConcurrency: 1, maxRetries: 1, modelName: "text-embedding-3-small" })
    );
    const docs = await loader.load();
    return docs
  } catch (error) {
    console.log(e);
    return false;
  }

}

export default getDocument;