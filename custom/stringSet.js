import { BaseOutputParser } from "langchain/schema/output_parser";

/**
 * Parse the output of an LLM call to a comma-separated list.
 */
class CommaSeparatedListOutputParser extends BaseOutputParser {
  async parse(text) {
    return text.split(",").map((item) => item.trim());
  }
}

const parser = new CommaSeparatedListOutputParser();

const arr = await parser.parse("this, is, set, of, string");
/* 
  ['this', 'is', 'set', 'of', 'string']
*/
export default arr;