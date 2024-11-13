// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai'; // Import OpenAI as the default export

interface TranslateRequestBody {
  text: string;
  sourceLang?: string;
  targetLangs: string[];
}



const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { text, targetLangs, sourceLang  } = (await request.json()) as TranslateRequestBody;
    if (!text || !targetLangs || targetLangs.length === 0) {
      return NextResponse.json(
        { error: 'Text and at least one target language are required.' },
        { status: 400 }
      );
    }

    

    const translations: Record<string, string> = {};

    for (const targetLang of targetLangs) {
      const prompt = `
      Translate the following text from ${sourceLang} to ${targetLang}. Please pay attention to context, especially when translating words that imply small items from ${sourceLang}.
      Only return the translated text without explanations or additional context. Maintain any HTML elements as they are. Do not eranged numbers if they are present
      Text: "${text}"
      `;


      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a translation assistant. Responding strictly with ONLY the translated text."},
            { role: "user", content: prompt }
          ],
      });

      const translatedText = response.choices[0].message?.content?.trim() || '';
      translations[targetLang] = translatedText;
    }

    return NextResponse.json({ translations }, { status: 200 });
  } catch (error: any) {
    console.error('OpenAI API Error:', error.message);
    return NextResponse.json({ error: 'Translation failed.' }, { status: 500 });
  }
}