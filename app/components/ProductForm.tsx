// components/ProductForm.tsx

import React, { useState, FormEvent } from 'react';
import { Send, Loader } from 'lucide-react'

interface ProductDetails {
  name: string;
  internalTitle: string;
  id: string;
}

interface ProductFormProps {
  sourceLang: string;
  targetLangs: string[];
  setProductTranslations: React.Dispatch<
    React.SetStateAction<Record<string, ProductDetails>>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean
}

const ProductForm: React.FC<ProductFormProps> = ({
  loading,
  sourceLang,
  targetLangs,
  setProductTranslations,
  setLoading,
  setError,
  setShowProductForm,
}) => {
  const [productName, setProductName] = useState(``);
  const [productInternalTitle, setProductInternalTitle] = useState(``);
  const [productId, setProductId] = useState('');

  const handleProductSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (targetLangs.length === 0) {
      setError('Please select at least one target language.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/translateAi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: encodeURIComponent(`${productName}\n${productInternalTitle}\n${productId}`), // Encode special characters
          sourceLang,
          targetLangs,
        }),
      });
      const data = await res.json();
     console.log('Api response:', data)
      if (!res.ok) {
        setError(data.error || 'An error occurred while translating.');
        return;
      }

      if (!data.translations) {
        setError('No translations found.');
        return;
      }

      // Process the translated data
      processProductTranslations(data.translations);

      // Close the product form
      setShowProductForm(false);

      // Reset product form fields
      setProductName('');
      setProductInternalTitle('');
      setProductId('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('An error occurred while translating.');
    } finally {
      setLoading(false);
    }
  };

  const normalizeId = (text: string): string => {
    return text
      .toLowerCase() // Convert to lowercase
      .replace(/[ėę]/g, 'e')
      .replace(/[į]/g, 'i')
      .replace(/[č]/g, 'c')
      .replace(/[ą]/g, 'a')
      .replace(/[ū]/g, 'u')
      .replace(/[^a-z0-9-]/g, ''); // Remove any remaining non-ASCII characters
  };

  const processProductTranslations = (translations: Record<string, string>) => {
    const newProductTranslations = Object.entries(translations).reduce(
      (acc, [lang, translatedText]) => {
        const decodedText = decodeURIComponent(translatedText);
        console.log(`Decoded translation for ${lang}:`, decodedText);
  
        // Split the decoded text by newline to extract name, internalTitle, and id
        const [name, internalTitle, id] = decodedText.split('\n');
  
        // Normalize `id` to remove accents and special characters
        const formattedId = id ? normalizeId(id) : '';
  
        acc[lang] = { name, internalTitle, id: formattedId };
        return acc;
      },
      {} as Record<string, ProductDetails>
    );
    setProductTranslations(newProductTranslations);
  };
  
  


  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={() => setShowProductForm(false)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Product Details
        </h2>
        <form onSubmit={handleProductSubmit} className="space-y-6">
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Product Name"
          />

          <input
            type="text"
            value={productInternalTitle}
            onChange={(e) => setProductInternalTitle(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Product Internal Title"
          />

          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Product url (e.g., car-monkey)"
          />

<button
      type="submit"
      disabled={loading}
      className="w-full flex items-center justify-center px-6 py-4 mt-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <Loader className="w-6 h-6 mr-3 animate-spin" />
          Translating...
        </>
      ) : (
        <>
          <Send className="w-6 h-6 mr-3" />
          Translate Product Details
        </>
      )}
    </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
