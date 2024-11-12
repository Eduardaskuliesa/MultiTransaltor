// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai'; // Import OpenAI as the default export

interface TranslateRequestBody {
  text: string;
  sourceLang?: string;
  targetLangs: string[];
}

// Initialize OpenAI with your API key
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
        const prompt = `Translate this text from ${sourceLang} to a ${targetLang}. ONLY return the translated text without any explanations or additional context. Just the translation: "${text}"`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a translation assistant. Strictly respond with ONLY the translated text" },
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