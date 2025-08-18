import React from 'react';

type Layout = 'list' | 'grid';

interface LayoutToggleProps {
  value: Layout;
  onChange: (layout: Layout) => void;
}

const ListIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="5" width="18" height="2" rx="1" fill={active ? '#111' : '#888'} />
    <rect x="3" y="11" width="18" height="2" rx="1" fill={active ? '#111' : '#888'} />
    <rect x="3" y="17" width="18" height="2" rx="1" fill={active ? '#111' : '#888'} />
  </svg>
);

const GridIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="3" y="3" width="8" height="8" rx="2" fill={active ? '#111' : '#888'} />
    <rect x="13" y="3" width="8" height="8" rx="2" fill={active ? '#111' : '#888'} />
    <rect x="3" y="13" width="8" height="8" rx="2" fill={active ? '#111' : '#888'} />
    <rect x="13" y="13" width="8" height="8" rx="2" fill={active ? '#111' : '#888'} />
  </svg>
);

const LayoutToggle: React.FC<LayoutToggleProps> = ({ value, onChange }) => {
  const isList = value === 'list';
  const isGrid = value === 'grid';
  return (
    <div className="layout-toggle" role="group" aria-label="Toggle layout">
      <button
        type="button"
        aria-pressed={isList}
        aria-label="List layout"
        title="List view"
        className={isList ? 'layout-toggle__btn layout-toggle__btn--active' : 'layout-toggle__btn'}
        onClick={() => onChange('list')}
      >
        <ListIcon active={isList} />
      </button>
      <button
        type="button"
        aria-pressed={isGrid}
        aria-label="Grid layout"
        title="Grid view"
        className={isGrid ? 'layout-toggle__btn layout-toggle__btn--active' : 'layout-toggle__btn'}
        onClick={() => onChange('grid')}
      >
        <GridIcon active={isGrid} />
      </button>
    </div>
  );
};

export default LayoutToggle;
