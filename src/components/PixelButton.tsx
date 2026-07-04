import { ButtonHTMLAttributes } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export default function PixelButton({ variant = 'primary', size = 'md', className = '', children, ...props }: PixelButtonProps) {
  const baseClasses = 'font-["Press_Start_2P"] leading-relaxed transition-all duration-150 active:translate-y-[2px] active:shadow-none cursor-pointer';

  const variants = {
    primary: 'bg-[#33ff66] text-[#0a0a1a] border-b-4 border-[#1a8833] hover:bg-[#55ff88] shadow-[0_4px_0_#1a8833]',
    secondary: 'bg-[#4488ff] text-white border-b-4 border-[#2244aa] hover:bg-[#6699ff] shadow-[0_4px_0_#2244aa]',
    danger: 'bg-[#ff4444] text-white border-b-4 border-[#aa2222] hover:bg-[#ff6666] shadow-[0_4px_0_#aa2222]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px]',
    md: 'px-6 py-3 text-[12px]',
    lg: 'px-8 py-4 text-[14px]',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ imageRendering: 'pixelated' }}
      {...props}
    >
      {children}
    </button>
  );
}