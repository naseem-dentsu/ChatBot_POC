const urls = [
  "https://bjxb-013.dx.commercecloud.salesforce.com/on/demandware.store/Sites-RefArch-Site",
]
const ChainPrompt = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`
Use the following pieces of context to answer the users question.
Add relevent links for your answer , make sure they are listed in an array with urls as object.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;

export default {
  urls,
  ChainPrompt
};