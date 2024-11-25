import React, { useState } from 'react';
import { getFlagEmoji } from '../utils/getFlagEmoji';
import { Copy, CheckCircle } from 'lucide-react';

interface Language {
  code: string;
  name: string;
}

interface ProductDetails {
  name: string;
  internalTitle: string;
  id: string;
}

interface ProductTranslationsDisplayProps {
  productTranslations: Record<string, ProductDetails>;
  availableLanguages: Language[];
}

const ProductTranslationsDisplay: React.FC<ProductTranslationsDisplayProps> = ({
  productTranslations,
  availableLanguages,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  console.log(productTranslations)
  const removeQuotes = (text: string) => {
     console.log(text)
    return text.replace(/^["']|["']$/g, ''); 
  };

  const handleCopy = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000); 
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Translated Product Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(productTranslations).map(([lang, details]) => {
          const language = availableLanguages.find((l) => l.code === lang);
          const languageName = language?.name || lang;
          const flagEmoji = getFlagEmoji(lang);

          return (
            <div
              key={lang}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-3">{flagEmoji}</span>
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {languageName}
                  </h3>
                </div>

                <div className="flex items-center text-gray-700 mb-2">
                  <p>
                    <strong>Product Name:</strong> {removeQuotes(details.name)}
                  </p>
                  <span className="text-sm text-gray-500 ml-2">({removeQuotes(details.name).length})</span>
                  <button
                    onClick={() => handleCopy(removeQuotes(details.name), `${lang}-name`)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    {copiedField === `${lang}-name` ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  {copiedField === `${lang}-name` && (
                    <span className="ml-2 text-green-500">Copied!</span>
                  )}
                </div>

                <div className="flex items-center text-gray-700 mb-2">
                  <p>
                    <strong>Internal Title:</strong> {removeQuotes(details.internalTitle)}
                  </p>
                  <span className="text-sm text-gray-500 ml-2">({removeQuotes(details.internalTitle).length})</span>
                  <button
                    onClick={() =>
                      handleCopy(removeQuotes(details.internalTitle), `${lang}-internalTitle`)
                    }
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    {copiedField === `${lang}-internalTitle` ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  {copiedField === `${lang}-internalTitle` && (
                    <span className="ml-2 text-green-500">Copied!</span>
                  )}
                </div>

                <div className="flex items-center text-gray-700">
                  <p>
                    <strong>Product ID:</strong> {removeQuotes(details.id)}
                  </p>
                  <span className="text-sm text-gray-500 ml-2">({removeQuotes(details.id).length})</span>
                  <button
                    onClick={() => handleCopy(removeQuotes(details.id), `${lang}-id`)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    {copiedField === `${lang}-id` ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  {copiedField === `${lang}-id` && (
                    <span className="ml-2 text-green-500">Copied!</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTranslationsDisplay;
