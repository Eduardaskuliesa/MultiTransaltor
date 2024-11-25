import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const DIMINUTIVE_CONTEXT = `
Common Lithuanian diminutive suffixes and their meanings:
- -elis, -ėlis: indicates smaller version
- -ukas, -iukas: indicates very small version
- -utis, -utė: indicates endearment and smallness
- -ytis, -ytė: indicates small and cute
- -ėtis, -aitė: indicates smallness with affection
- -ulis, -ulė: indicates endearment
- -užis, -užė: indicates small with emotional attachment
- -iokas: indicates moderate size
- -inas, -ukšlis: indicates smaller than normal
- -ėzas, -ūzas: indicates tiny version
  For german  Werktage`;

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_SECRET
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { text, targetLangs, sourceLang } = await request.json();
    console.log(text)
    
    const translations: Record<string, string> = {};
    
    for (const targetLang of targetLangs) {
      const systemMessage = `You are a translation engine. Your sole purpose is to output the translated text with no additional explanations, notes, or formatting. 
Rules:
0. Return /n all in the same postion you find them.
1. Return ONLY the translated text
2. Never add explanations or notes
3. Never add quotes around the translation
4. Preserve exact formatting from input
5. Preserve all special characters
6. Pay attention to Lithuanian diminutive meanings:
${DIMINUTIVE_CONTEXT}`;

      const prompt = `Translate this text from ${sourceLang} to ${targetLang}. Return only the translation, no explanations:

${text}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: prompt }
        ],
      });

      const translatedText = response.choices[0].message?.content?.trim() || '';
      translations[targetLang] = translatedText;
    }

    return NextResponse.json({ translations }, { status: 200 });
    
  } catch (error: any) {
    console.error('Translation Error:', error);
    return NextResponse.json(
      { error: 'Translation failed', details: error.message },
      { status: 500 }
    );
  }
}