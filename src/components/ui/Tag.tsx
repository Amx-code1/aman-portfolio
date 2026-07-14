
import React from 'react';
import './Tag.css';

interface TagProps {
  children: React.ReactNode;
  tone?: 'cyan' | 'pink' | 'purple' | 'default';
  className?: string;
}

export const Tag = React.memo(function Tag({ children, tone = 'default', className }: TagProps) {
  return <span className={`ui-tag ui-tag--${tone} ${className ?? ''}`}>{children}</span>;
});
