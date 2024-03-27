import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";


const embeddings = new OpenAIEmbeddings({ maxConcurrency: 1, maxRetries: 1, modelName: "text-embedding-3-small" })


const htmlSplitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
  chunkSize: 2000,
  chunkOverlap: 400,
});

const textSplitter = new RecursiveCharacterTextSplitter(
  {
    chunkSize: 2000,
    chunkOverlap: 400,
  }
)

/**
 * Splits the collected data / text into smaller chunks which 
 * are then converted into indexes and saved locally for future purpose
 * @param {document} data 
 * @param {string} directory 
 * @param {html | text} type 
 * @returns true | false
 */
export async function splitAndStoreDocuments(data, directory, type) {
  try {
    //split document in different chunks
    let splitter = type === "html" ? htmlSplitter : textSplitter;

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