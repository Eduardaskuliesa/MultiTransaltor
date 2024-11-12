// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { TranslateClient, TranslateTextCommand } from '@aws-sdk/client-translate';

interface TranslateRequestBody {
  text: string;
  sourceLang?: string;
  targetLangs: string[];
}

interface TranslationResponse {
  translatedText: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { text, sourceLang, targetLangs } = (await request.json()) as TranslateRequestBody;
    console.log(text, sourceLang, targetLangs)
    console.log('API Request Data:', { text, sourceLang, targetLangs});

    
    if (!text || !targetLangs) {
      return NextResponse.json(
        { error: 'Text and target language are required.' },
        { status: 400 }
      );
    }
    console.log('Region:', process.env.AMAZON_REGION)
    // Initialize AWS Translate Client
    const translateClient = new TranslateClient({
      region: process.env.AMAZON_REGION || "",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY || "",
        secretAccessKey:process.env.AWS_SECRET_KEY || ""
      },
    });

    const translations: Record<string, string> = {}
    for (const targetLang of targetLangs) {
        
        const params = {
          Text: text,
          SourceLanguageCode: sourceLang || 'auto', 
          TargetLanguageCode: targetLang,
        };

    
     const command = new TranslateTextCommand(params);
     const response = await translateClient.send(command);

     const translatedText = response.TranslatedText || '';
      translations[targetLang] = translatedText;
      console.log(`Translated Text to ${targetLang}:`, translatedText);

    }

    return NextResponse.json({ translations }, { status: 200 });
  } catch (error: any) {
    console.error('Amazon Translate API Error:', error.message);

    
    return NextResponse.json({ error: 'Translation failed.' }, { status: 500 });
  }
}
