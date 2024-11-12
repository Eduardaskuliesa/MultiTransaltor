

export function getFlagEmoji(langCode: string) {
    const codeMappings: { [key: string]: string } = {
      de: '🇩🇪',
      lv: '🇱🇻',
      it: '🇮🇹',
      pl: '🇵🇱',
      en: '🇬🇧',
      es: '🇪🇸',
      fr: '🇫🇷',
      lt: '🇱🇹',
    };
  
    return codeMappings[langCode] || '🏳️';
  }
  