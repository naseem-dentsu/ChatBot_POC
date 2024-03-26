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
    return data;
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
    );
    const docs = await loader.load();
    return docs
  } catch (error) {
    console.log(e);
    return false;
  }

}

export default getDocument;