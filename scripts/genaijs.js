const { GoogleGenAI } = require('@google/genai');
const { setGlobalDispatcher, ProxyAgent } = require("undici"); 
const dispatcher = new ProxyAgent({ uri: new URL('http://127.0.0.1:7890').toString() });
setGlobalDispatcher(dispatcher); 
setGlobalDispatcher(dispatcher); 
require('dotenv').config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function main() {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: 'Why is the sky blue?',
  });
  console.log(response.text);
}

main();