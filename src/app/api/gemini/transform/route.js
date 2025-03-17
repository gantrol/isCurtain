// app/api/gemini/transform/route.js
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';


export async function POST(request) {
  // try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const bytes = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');
    const providedApiKey = formData.get('apiKey');
    const apiKey = providedApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("API key is missing."); // Log missing API key
      return NextResponse.json({ error: 'API key is missing' }, { status: 400 });
    }

    if (!imageFile) {
      console.error("Image file is required."); // Log missing image file
      return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseModalities: ["Text", "Image"],
    };

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig,
    });

    const history = [
      {
        role: "user",
        parts: [
          { text: "用户将输入一张图片，你的任务是将图片中的衣服转化为窗帘，窗帘的布料、花纹等应当于衣服一致。用户可能会上传：\n\n1. 穿着衣服的人物\n2. 只有衣服本身\n3. 其他\n\n如果你明白了，那么请回答“明白”" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: "明白" },
        ],
      },
    ];

    const prompt = "请将这个衣服转换为窗帘。确保窗帘的布料、花纹、颜色与衣服一致。窗帘应该挂在窗户上，有自然的褶皱和光影效果。生成高质量的窗帘图像。";

    let result;

    try {

      const chat = model.startChat({
        generationConfig,
        history,
      });

      const messageParts = [];
      console.log(
        "Base64 image length:",
        base64Image.length,
      );

      messageParts.push({ text: prompt });
      messageParts.push({
        inlineData: {
          mimeType: imageFile.type,
          data: base64Image
        }
      });

      result = await chat.sendMessage(messageParts);
    }
    catch (error) {
      console.error('Gemini API transformation error:', error);
      return NextResponse.json({ error: 'Failed to transform image to curtain', details: error.message }, { status: 500 });
    }
    const response = result.response;

    let textResponse = null;
    let imageData = null;
    let mimeType = "image/png";

    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      console.log("Number of parts in response:", parts.length);

      for (const part of parts) {
        if ("inlineData" in part && part.inlineData) {
          // Get the image data
          imageData = part.inlineData.data;
          mimeType = part.inlineData.mimeType || "image/png";
          console.log(
            "Image data received, length:",
            imageData.length,
            "MIME type:",
            mimeType
          );
        } else if ("text" in part && part.text) {
          // Store the text
          textResponse = part.text;
          console.log(
            "Text response received:",
            textResponse.substring(0, 50) + "..."
          );
        }
      }
    }

    return NextResponse.json({
      image: imageData ? `data:${mimeType};base64,${imageData}` : null,
      description: textResponse,
    });
  // } catch (error) {
  //   console.error("Error generating image:", error);
  //   return NextResponse.json(
  //     {
  //       error: "Failed to generate image",
  //       details: error instanceof Error ? error.message : String(error),
  //     },
  //     { status: 500 }
  //   );
  // }
}