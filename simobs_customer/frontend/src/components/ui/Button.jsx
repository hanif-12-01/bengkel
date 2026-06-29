import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:-translate-y-0.5 hover:shadow-premium',
    secondary: 'bg-secondary text-secondary-foreground hover:-translate-y-0.5 hover:shadow-premium',
    outline: 'border border-border bg-transparent text-text hover:border-primary hover:text-primary',
    ghost: 'hover:bg-secondary/20 text-text',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-premium hover:-translate-y-0.5',
    accent: 'bg-accent text-accent-foreground hover:-translate-y-0.5 hover:shadow-premium',
  };

  const sizes = {
    default: 'h-11 px-6 py-2',
    sm: 'h-9 rounded-md px-4 text-sm',
    lg: 'h-14 rounded-xl px-10 text-lg font-semibold',
    icon: 'h-11 w-11',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';