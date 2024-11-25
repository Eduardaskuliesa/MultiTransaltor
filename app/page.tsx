
'use client'
import React, { useState } from 'react';
import { Globe2, Plus } from 'lucide-react';
import TranslationForm from './components/TranslationForm';
import ProductForm from './components/ProductForm';
import TranslationsDisplay from './components/TranslationDisplay';
import ProductTranslationsDisplay from './components/ProductTranslationDisplay';

interface Language {
  code: string;
  name: string;
}

const Home: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<string>('lt');
  const [targetLangs, setTargetLangs] = useState<string[]>(['en', 'de', 'lv']);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [productTranslations, setProductTranslations] = useState<
    Record<string, { name: string; internalTitle: string; id: string }>
  >({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);

  const availableLanguages: Language[] = [
    { code: 'de', name: 'German' },
    { code: 'lv', name: 'Latvian' },
    { code: 'it', name: 'Italian' },
    { code: 'pl', name: 'Polish' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'lt', name: 'Lithuanian' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Globe2 className="mx-auto h-16 w-16 text-blue-600 mb-6" />
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Multi-language Translator Onprint.lt
          </h1>
        </div>

        {/* Translation Form */}
        <TranslationForm
        loading={loading}
         setShowProductForm={setShowProductForm}
          availableLanguages={availableLanguages}
          sourceLang={sourceLang}
          setSourceLang={setSourceLang}
          targetLangs={targetLangs}
          setTargetLangs={setTargetLangs}
          setTranslations={setTranslations}
          setLoading={setLoading}
          setError={setError}
        />

        
        

        {/* Loading and Error Messages */}
        {loading && (
          <div className="mt-8 text-center">
            <p className="text-xl text-gray-600">Translating...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 text-center">
            <p className="text-xl text-red-600">{error}</p>
          </div>
        )}

        {/* Translations Display */}
        {Object.keys(translations).length > 0 && (
          <TranslationsDisplay
            translations={translations}
            availableLanguages={availableLanguages}
          />
        )}

        {/* Product Translations Display */}
        {Object.keys(productTranslations).length > 0 && (
          <ProductTranslationsDisplay
            productTranslations={productTranslations}
            availableLanguages={availableLanguages}
          />
        )}

        {/* Product Form Modal */}
        {showProductForm && (
          <ProductForm
            loading={loading}
            sourceLang={sourceLang}
            targetLangs={targetLangs}
            setProductTranslations={setProductTranslations}
            setLoading={setLoading}
            setError={setError}
            setShowProductForm={setShowProductForm}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
