import React from 'react';
import { motion } from 'framer-motion';
import { getTextColorForBackground } from '../utils/colorUtils';

export const genreColors: Record<string, string> = {
  Finance: '#27AE60',
  Entrepreneurship: '#E67E22',
  Psychology: '#8E44AD',
  Technology: '#2980B9',
  Fiction: '#C0392B',
  History: '#7F8C8D',
};

interface GenreBadgeProps {
  genre: string;
}

const GenreBadge: React.FC<GenreBadgeProps> = ({ genre }) => {
  const bgColor = genreColors[genre] || '#BDC3C7'; // default gray
  const textColor = getTextColorForBackground(bgColor);

  return (
    <motion.span
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        padding: '0.3rem 0.6rem',
        borderRadius: '12px',
        fontSize: '0.85rem',
        fontWeight: 500,
        display: 'inline-block',
        minWidth: '70px',
        textAlign: 'center',
      }}
    >
      {genre}
    </motion.span>
  );
};

export default GenreBadge;