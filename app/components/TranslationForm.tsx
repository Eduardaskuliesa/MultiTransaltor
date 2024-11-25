import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Languages, Globe, Send, Plus, Loader, Trash2 } from 'lucide-react';

interface Language {
  code: string;
  name: string;
}

interface TranslationFormProps {
  loading: boolean;
  availableLanguages: Language[];
  sourceLang: string;
  setSourceLang: React.Dispatch<React.SetStateAction<string>>;
  targetLangs: string[];
  setTargetLangs: React.Dispatch<React.SetStateAction<string[]>>;
  setTranslations: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setShowProductForm: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

const TranslationForm: React.FC<TranslationFormProps> = ({
  availableLanguages,
  setShowProductForm,
  loading,
  sourceLang,
  setSourceLang,
  targetLangs,
  setTargetLangs,
  setTranslations,
  setLoading,
  setError,
}) => {
  const [text, setText] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
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
        body: JSON.stringify({ text, sourceLang, targetLangs }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An error occurred while translating.');
        return;
      }

      if (!data.translations) {
        setError('No translations found.');
        return;
      }

      setTranslations(data.translations);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('An error occurred while translating.');
    } finally {
      setLoading(false);
    }
  };

  const handleTargetLangChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setTargetLangs((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((name) => name !== value)
    );
  };

  const handleDelete = () => {
    setText("")
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-lg p-8">
      <div>
        <label className="text-lg flex flex-row  font-medium text-gray-700 mb-3">
          <Languages className="inline-block w-6 h-6 mr-2 text-gray-500" />
          Text to Translate
          <button type='button' onClick={handleDelete}><Trash2 className='h-6 ml-2 w-6 text-red-500 hover:text-red-600'></Trash2></button>
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          className="w-full h-40 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter text to translate..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Source Language Selection */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            <Globe className="inline-block w-6 h-6 mr-2 text-gray-500" />
            Source Language
          </label>
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {availableLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Target Languages Selection */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Target Languages
          </label>
          <div className="grid grid-cols-2 gap-3 p-4 border border-gray-300 rounded-md max-h-64 overflow-y-auto">
            {availableLanguages.map((lang) => (
              <div key={lang.code} className="flex items-center space-x-3">
                <input
                 checked={targetLangs.includes(lang.code)}
                  type="checkbox"
                  value={lang.code}
                  onChange={handleTargetLangChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-lg text-gray-700">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        disabled={loading}
        type="submit"
        className="w-full flex items-center justify-center px-6 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {loading ? (
          <Loader className="w-6 h-6 mr-3 animate-spin" />
        ) : (
          <Send className="w-6 h-6 mr-3" />
        )}
        Translate
      </button>

      <button
        type="button"
        onClick={() => setShowProductForm(true)}
        className="w-full flex items-center justify-center px-6 py-4 mt-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <Plus className="w-6 h-6 mr-3" />
        Add Product Details
      </button>
    </form>
  );
};

export default TranslationForm;
