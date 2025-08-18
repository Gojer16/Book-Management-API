import React, { useEffect, useMemo, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: { title?: string; author?: string; tags?: string }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);
  
  const debounced = useMemo(() => {
    return (fn: () => void, delay = 350) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(fn, delay);
    };
  }, []);

  useEffect(() => {
    debounced(() => onSearchRef.current({ title, author, tags }), 350);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [title, author, tags, debounced]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="search-bar__input"
      />
      <input
        type="text"
        placeholder="Search author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="search-bar__input"
      />
      <input
        type="text"
        placeholder="Search tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        className="search-bar__input"
      />
    </div>
  );
};

export default SearchBar;
