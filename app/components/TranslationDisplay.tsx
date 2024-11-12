

import React from 'react';


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
  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Translations
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(translations).map(([lang, translatedText]) => {
          const language = availableLanguages.find((l) => l.code === lang);
          const languageName = language?.name || lang;
          

          return (
            <div
              key={lang}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center mb-4">
                  
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {languageName}
                  </h3>
                </div>
                <p className="text-gray-700">{translatedText}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranslationsDisplay;
