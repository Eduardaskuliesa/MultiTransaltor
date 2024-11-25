import { CopyIcon } from 'lucide-react';
import React, { useState } from 'react';

interface Language {
  code: string;
  name: string;
}

interface TranslationsDisplayProps {
  translations: Record<string, string>;
  availableLanguages: Language[];
}

const TranslationsDisplay: React.FC<TranslationsDisplayProps> = ({
  translations,
  availableLanguages,
}) => {
  const [copiedLanguages, setCopiedLanguages] = useState<Record<string, boolean>>({});
  
  const handleCopy = (text: string, lang: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopiedLanguages((prevState) => ({
          ...prevState,
          [lang]: true,
        }));
        
        setTimeout(() => {
          setCopiedLanguages((prevState) => ({
            ...prevState,
            [lang]: false,
          }));
        }, 2000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };



  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Translations
      </h2>
      <div className="grid grid-cols-1 max-h-[500px] overflow-y-auto overflow-x-hidden sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(translations).map(([lang, translatedText]) => {
          const language = availableLanguages.find((l) => l.code === lang);
          const languageName = language?.name || lang;
          const cleanedTranslatedText = translatedText.replace(/^"|"$/g, '');
          const isCopied = copiedLanguages[lang];
          const characterCount = cleanedTranslatedText.length;

          return (
            <div
              key={lang}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center flex-row justify-between mb-4">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {languageName}
                  </h3>
                  <div className="flex items-center">
                    {isCopied && (
                      <span className="ml-2 text-green-500">Copied!</span>
                    )}
                    <button
                      onClick={() => handleCopy(cleanedTranslatedText, lang)}
                      className="px-4 py-2"
                    >
                      <CopyIcon className="h-6 w-6 text-blue-600 hover:text-blue-700" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{cleanedTranslatedText}</p>
              </div>
              <div className="mt-4 text-right text-gray-500">
                <span>Characters: {characterCount}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranslationsDisplay;
