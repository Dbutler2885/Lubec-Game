import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSelected?: boolean;
}

export const Button: React.FC<ButtonProps> = 
  ({ children, isSelected = false, className = "", ...props }) => (
  <button 
    {...props}
    className={`
      px-3 py-2 text-center
      font-mono text-sm font-bold
      ${isSelected 
        ? 'bg-gray-600 text-white border-t-gray-400 border-l-gray-400 border-b-gray-800 border-r-gray-800' 
        : 'bg-gray-300 text-gray-800 border-t-white border-l-white border-b-gray-600 border-r-gray-600 hover:bg-gray-400'}
      border-2
      transform active:translate-y-px active:translate-x-px
      active:border-t-gray-600 active:border-l-gray-600 active:border-b-gray-300 active:border-r-gray-300
      transition-all duration-50 shadow-md
      ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `}
    style={{
      boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.1)',
    }}
  >
    {children}
  </button>
);

export default Button;