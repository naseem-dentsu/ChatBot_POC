import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export async function searchApi(endpoint, query) {

  if (process.env.AZURE_OPENAI_API_KEY) {
    throw new Error(
      "Azure OpenAI API does not support embedding with multiple inputs yet"
    );
  }

  const model = new ChatOpenAI({ temperature: 0 });
  const embeddings = new OpenAIEmbeddings(
    process.env.AZURE_OPENAI_API_KEY
      ? { azureOpenAIApiDeploymentName: "Embeddings2" }
      : {}
  );
  const browser = new WebBrowser({ model, embeddings });

  const result = await browser.call(
    `'https://www.shiseido.co.uk/gb/en/',"${query}"`
  );
  return result

  // console.log("search results == ", result);
}