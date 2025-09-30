import React, { useState, useEffect } from 'react';

interface SearchBoxProps {
  onSearch: (keywords: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ onSearch }) => {
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(keywords);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [keywords, onSearch]);

  return (
    <div className="search-box">
      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="Search for products..."
      />
    </div>
  );
};

export default SearchBox;
