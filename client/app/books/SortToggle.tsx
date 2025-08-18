import React, { useEffect, useRef, useState } from 'react';

type SortKey = 'title' | 'publicationYear' | 'rating';
type SortOrder = 'asc' | 'desc';

interface SortToggleProps {
  onChange: (sort: { sort: SortKey; order: SortOrder }) => void;
}

const SortToggle: React.FC<SortToggleProps> = ({ onChange }) => {
  const [sort, setSort] = useState<SortKey>('title');
  const [order, setOrder] = useState<SortOrder>('asc');

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current({ sort, order });
  }, [sort, order]);

  return (
    <div className="sort-toggle">
      <select
        value={sort}
        onChange={(e) => {
          const next = e.target.value as SortKey;
          setSort(next);
          // Sensible defaults: A–Z asc, newest desc, rating desc
          if (next === 'title') {
            setOrder('asc');
          } else {
            setOrder('desc');
          }
        }}
        className="sort-toggle__select"
      >
        <option value="title">A–Z</option>
        <option value="publicationYear">Newest</option>
        <option value="rating">Rating</option>
      </select>
      <button type="button" onClick={() => setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))} className="sort-toggle__order">
        {order === 'asc' ? 'Asc' : 'Desc'}
      </button>
    </div>
  );
};

export default SortToggle;
