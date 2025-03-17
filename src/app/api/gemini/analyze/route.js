// app/api/gemini/analyze/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const PROMPT_CHINESE = `\n\n现在要回答“这件衣服像不像窗帘”。给出1-5的评分（1表示完全不像，5表示非常像）。
请你：
1. 先对比衣服以及生成的窗帘图片，如果有很大差异，那么回复“这衣服好像没法找到对应窗帘款式”，评分为1或2，结束；
2. 如果像，只看窗帘图片，分析它是否像现实的某款窗帘，给出评分。`

const PROMPT_ENGLISH = `\n\nWe need to answer the question: "Does this clothing look like a curtain?" Please provide a rating from 1 to 5 (1 being "not at all" and 5 being "very much like").
You need to do:

1. **Compare** the clothing item with the generated curtain image. If there's a significant difference between them, reply with: "This clothing doesn't seem to have a corresponding curtain style." Then give it a rating of 1 or 2, and stop.
2. **If they look similar**, focus solely on the curtain image. Analyze whether it resembles a real-world curtain style. Then provide a rating.`

export async function POST(request) {
  try {
    const { originalImage, curtainImage, apiKey: providedApiKey, language = "en" } = await request.json();
    const apiKey = providedApiKey || process.env.GEMINI_API_KEY;
    
    console.log("Original Image(B):", originalImage.length); // Debug log
    
    // Extract base64 data from the curtain image URL if it's in data URL format
    let curtainBase64 = curtainImage;
    if (curtainImage && typeof curtainImage === 'string' && curtainImage.startsWith('data:')) {
      curtainBase64 = curtainImage.split(',')[1];
    }
    
    console.log("Curtain Image(B):", curtainBase64?.length); // Debug log

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use structured output model for analysis
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.618,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      }
    });

    // Prepare system prompt to guide the JSON output format
    const systemPrompt = `Please respond in ${language} with JSON format with these exact fields: { \"rating\": number, \"analysis\": string }. The rating should be between 1-5, where 1 means not similar at all and 5 means very similar.`;

    let userPrompt;
    console.log(language)
    if (language === 'en') {
      userPrompt = PROMPT_ENGLISH;
    } else if (language === 'zh') {
      userPrompt = PROMPT_CHINESE;
    } else {
      userPrompt = PROMPT_ENGLISH;
    }
    // Generate content with proper formatting of image data
    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [
          { text: systemPrompt + userPrompt},
          { inlineData: { mimeType: "image/jpeg", data: originalImage } },
          { inlineData: { mimeType: "image/png", data: curtainBase64 } }
        ]
      }]
    });

    const responseText = result.response.text();
    
    // More robust JSON parsing
    let responseJson;
    try {
      responseJson = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON response:', responseText);
      // Fallback parsing if the response isn't properly formatted JSON
      const ratingMatch = responseText.match(/"rating"\s*:\s*(\d+)/);
      const analysisMatch = responseText.match(/"analysis"\s*:\s*"([^"]*)"/);
      
      responseJson = {
        rating: ratingMatch ? parseInt(ratingMatch[1]) : 3,
        analysis: analysisMatch ? analysisMatch[1] : 'Unable to analyze similarity.'
      };
    }

    return NextResponse.json({
      rating: responseJson.rating,
      analysis: responseJson.analysis
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Analysis failed', details: error.message }, { status: 500 });
  }
}