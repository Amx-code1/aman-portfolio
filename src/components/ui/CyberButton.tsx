
import React from 'react';
import './CyberButton.css';

interface CyberButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  className?: string;
  type?: 'button' | 'submit';
}

export const CyberButton = React.memo(function CyberButton({
  children,
  href,
  onClick,
  variant = 'ghost',
  className,
  type = 'button',
}: CyberButtonProps) {
  const cls = `cyber-btn cyber-btn--${variant} ${className ?? ''}`;
  if (href) {
    return (
      <a className={cls} href={href} onClick={onClick} data-cursor="hover">
        {children}
        <span className="cyber-btn__sheen" aria-hidden="true" />
      </a>
    );
  }
  return (
    <button className={cls} type={type} onClick={onClick} data-cursor="hover">
      {children}
      <span className="cyber-btn__sheen" aria-hidden="true" />
    </button>
  );
});
