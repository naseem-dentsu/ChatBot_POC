// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { ChatPromptTemplate } from "langchain/prompts";
// import { StructuredOutputParser , ResponseSchema } from "langchain/schema/output_parser";

// /**
//  * Parse the output of an LLM call to a comma-separated list.
//  */
// class CommaSeparatedListOutputParser extends BaseOutputParser {
//   async parse(text){
//     return text.split(",").map((item) => item.trim());
//   }
// }

// // const template = `You are a helpful assistant who generates comma separated lists.
// // A user will pass in a category, and you should generate 5 objects in that category in a comma separated list.
// // ONLY return a comma separated list, and nothing more.`;

// const template = `You are a denstu store which generates an ouput in json format.
// A user will pass in a category, and you should generate 5 objects in that category in json object.
// ONLY return a json format, and nothing more.`;

// const humanTemplate = "{text}";

// /**
//  * Chat prompt for generating comma-separated lists. It combines the system
//  * template and the human template.
//  */
// const chatPrompt = ChatPromptTemplate.fromMessages(
//   [
//     ["system", template],
//     ["human", humanTemplate],
//   ]
// );

// // const parser = new CommaSeparatedListOutputParser();

// // const chain = chatPrompt.pipe(parser);

// const chain = BaseOutputParser.parse(chatPrompt)

// const result = await chain.invoke({
//   text: "colors",
// });

// export default result;

// /*
//   ["red", "blue", "green", "yellow", "orange"]
// */



import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "langchain/prompts";
import { BaseOutputParser } from "langchain/schema/output_parser";

/**
 * Parse the output of an LLM call to a comma-separated list.
 */
export class CommaSeparatedListOutputParser extends BaseOutputParser {
  async parse(text) {
    return text.split(",").map((item) => item.trim());
  }
}

const template = `You are a denstu store which generates an ouput in json format.
A user will pass in a category, and you should generate 5 objects in that category in json object.
ONLY return a json format, and nothing more.`;

const humanTemplate = "{text}";

/**
 * Chat prompt for generating comma-separated lists. It combines the system
 * template and the human template.
 */

export const chatPrompt = ChatPromptTemplate.fromMessages(
  [
    ["system", template],
    ["human", humanTemplate],
  ]
);


/*
  ["red", "blue", "green", "yellow", "orange"]
*/