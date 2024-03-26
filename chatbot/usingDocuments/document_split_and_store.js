import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { FaissStore } from "langchain/vectorstores/faiss";


const embeddings = new OpenAIEmbeddings();

const htmlSplitter = RecursiveCharacterTextSplitter.fromLanguage("html", {
  chunkSize: 1000,
  chunkOverlap: 200,
});

const textSplitter = RecursiveCharacterTextSplitter(
  {
    chunkSize: 1000,
    chunkOverlap: 200,
  }
)


export async function splitAndStoreDocuments(data, directory, type) {
  try {
    //split document in different chunks
    let splitter = type === "html" ? htmlSplitter : textSplitter;

    const docs = await splitter.splitDocuments(data);

    const OpenAI_VectorStore = await FaissStore.fromDocuments(
      docs,
      embeddings
    );
    //store the file 
    await OpenAI_VectorStore.save(directory);
    return true
  }
  catch (e) {
    console.log(e);
    return false;
  }
}