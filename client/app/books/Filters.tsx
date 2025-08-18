import React, { useEffect, useMemo, useRef, useState } from 'react';
import { genreColors } from '../constants/genreColors';

interface FiltersProps {
  onChange: (filters: { genre?: string; publicationYear?: string | number }) => void;
}

const Filters: React.FC<FiltersProps> = ({ onChange }) => {
  const [genre, setGenre] = useState<string>('');
  const [year, setYear] = useState<string>('');

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const debounce = useMemo(() => (fn: () => void, delay = 300) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fn, delay);
  }, []);

  useEffect(() => {
    debounce(() => onChangeRef.current({
      genre: genre || undefined,
      publicationYear: year || undefined,
    }), 300);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [genre, year, debounce]);

  const years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => String(current - i));
  }, []);

  return (
    <div className="filters">
      <select
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
        className="filters__select"
      >
        <option value="">All Genres</option>
        {Object.keys(genreColors).map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="filters__select"
      >
        <option value="">All Years</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
