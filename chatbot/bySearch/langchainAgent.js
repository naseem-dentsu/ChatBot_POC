import {
  LLMSingleActionAgent,
  AgentActionOutputParser,
  AgentExecutor,
} from "langchain/agents";
import { LLMChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import {
  BaseStringPromptTemplate,
  renderTemplate,
} from "langchain/prompts";
import { SerpAPI, Tool } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { searchApi } from "./searchApi.js";

const PREFIX = `Answer the following questions as best you can. You have access to the following tools:`;
const SUFFIX = `Begin!

  Question: {input}
  Thought:{agent_scratchpad}`;

const formatInstructions = (
  toolNames, input, tools
) => `Clarina is a professional beauty coach working for shiseido (shiseido.co.uk) whos primary tasks is to help users navigate shiseido.co.uk and help them get their questions answered ragrding the varios products on the website.

  Clarina always recommends products from shiseido.co.uk which are relevant to the topic at hand and NOT of any of other brands.

  Clarina is designed to be able to assist with a wide range of tasks, from answering simple questions to providing in-depth explanations and discussions on a wide range of beauty topics. As a beauty coach, Clarina is able to generate expert opions on beauty related topics based on the input it receives, allowing it to engage in natural-sounding conversations and provide responses that are coherent and relevant to the topic at hand.

  Clarina is constantly learning and improving, and her capabilities are constantly evolving. She is able to process and understand large amounts of text, and can use this knowledge to provide accurate and informative responses to a wide range of questions from the cosmetics and beauty domain. Additionally, Clarina is able to generate her own text based on the input it receives, allowing it to engage in discussions and provide explanations and descriptions on a wide range of beauty and cosmetics topics.

  Overall, Clarina is a powerful assistant who can help with a wide range of beauty and cosmetic related tasks and provide valuable insights and information on a wide range of beauty and cosmetic topics. Whether you need help with a specific question or just want to have a conversation about a particular topic, Clarina is here to assist.

  TOOLS:
  ------

  Assistant has access to the following tools: 

  ${tools}

  To use a tool, please use the following format:


  Thought: Do I need to use a tool? Yes
  Action: the action to take, should be one of [${toolNames}]
  Action Input: the input to the action
  Observation: the result of the action
  ... (this Thought/Action/Action Input/Observation can repeat N times)
  Thought: I now know the final answer
  Final Answer: the final answer to the original input question


  When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:

  AI: [your response here]

  Keep the following in mind while providing the final answer:
      -Make sure to use only the product data available on shiseido.co.uk to provide information relating to shiseido products. If you do not know the answer, do not halucinate. 
      -Format your answer as markdown and insert URL to the products in the answer when any product is suggested as part of the final answer. Make sure to sperate out the URLs in different lines.
      -Try to upsell products to the consumer by suggesting products or services available on shiseido.co.uk that will compliment their purchase or interest.

  Begin! Remember to answer as a professional beauty coach when giving your final answer.

  New input: ${input}`;

class CustomPromptTemplate extends BaseStringPromptTemplate {
  tools;

  constructor(args) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
  }

  _getPromptType() {
  }

  format(input) {
    /** Construct the final template */
    const toolStrings = this.tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join("\n");
    const toolNames = this.tools.map((tool) => tool.name).join("\n");
    const instructions = formatInstructions(toolNames, input);
    const template = [PREFIX, toolStrings, instructions, SUFFIX].join("\n\n");
    /** Construct the agent_scratchpad */
    const intermediateSteps = input.intermediate_steps;
    const agentScratchpad = intermediateSteps.reduce(
      (thoughts, { action, observation }) =>
        thoughts +
        [action.log, `\nObservation: ${observation}`, "Thought:"].join("\n"),
      ""
    );
    const newInput = { agent_scratchpad: agentScratchpad, ...input };
    /** Format the template. */
    return Promise.resolve(renderTemplate(template, "f-string", newInput));
  }

  partial(_values) {
    throw new Error("Not implemented");
  }

  serialize() {
    throw new Error("Not implemented");
  }
}

class CustomOutputParser extends AgentActionOutputParser {
  lc_namespace = ["langchain", "agents", "custom_llm_agent"];

  async parse(text) {
    console.log("agent output =", text);
    if (text.includes("Final Answer:")) {
      const parts = text.split("Final Answer:");
      const input = parts[parts.length - 1].trim();
      const finalAnswers = { output: input };
      return { log: text, returnValues: finalAnswers };
    }


    if (text.includes("AI:")) {
      const parts = text.split("AI:");
      const input = parts[parts.length - 1].trim();
      const finalAnswers = { output: input };
      return { log: text, returnValues: finalAnswers };
    }

    const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
    if (!match) {
      throw new Error(`Could not parse LLM output: ${text}`);
    }

    return {
      tool: match[1].trim(),
      toolInput: match[2].trim().replace(/^"+|"+$/g, ""),
      log: text,
    };
  }

  getFormatInstructions() {
  }
}

export const run = async (input_text) => {
  const model = new OpenAI({ temperature: 0 });
  const tools = [
    searchApi,
    new Calculator(),
  ];

  const llmChain = new LLMChain({
    prompt: new CustomPromptTemplate({
      tools,
      inputVariables: ["input", "agent_scratchpad"],
    }),
    llm: model,
  });

  const agent = new LLMSingleActionAgent({
    llmChain,
    outputParser: new CustomOutputParser(),
    stop: ["\nObservation"],
  });
  const executor = new AgentExecutor({
    agent,
    tools,
  });
  // console.log("Loaded agent.");

  const input = input_text;

  // console.log(`Executing with input "${input}"...`);

  const result = await executor.call({ input });

  // console.log(`Got output ${result.output}`);
  return result;
};