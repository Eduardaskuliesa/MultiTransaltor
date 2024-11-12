

import React from 'react';
import { getFlagEmoji } from '../utils/getFlagEmoji';

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
                <p className="text-gray-700">
                  <strong>Product Name:</strong> {details.name}
                </p>
                <p className="text-gray-700">
                  <strong>Internal Title:</strong> {details.internalTitle}
                </p>
                <p className="text-gray-700">
                  <strong>Product ID:</strong> {details.id}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductTranslationsDisplay;
