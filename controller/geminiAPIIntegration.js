const {GoogleGenAI} = require('@google/genai');
const { Headers } = require('node-fetch');
global.Headers = Headers;

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
module.exports.GoogleGenAI = async function(req,res){
    const {prompt} = req.body;
    try{
      const model = 'gemini-2.0-flash';
      const contents = [{ role: 'user', parts: [{ text: prompt }] }];
      const config = { responseMimeType: 'text/plain' };
      const result = await genAI.models.generateContentStream({ model, config, contents });
      let finalText = '';
    for await (const chunk of result) {
      finalText += chunk.text;
    }
    console.log("enhance text:", finalText)
    res.json({ enhanced: finalText });
    }catch(error){
      console.error('Gemini error:', error);
    }


}