// app/components/Button.jsx
import Link from 'next/link';

const Button = ({ children, variant = 'default', className = '', href, ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2';

  const variantStyles = {
    default: 'bg-[#EC5E54] text-white hover:bg-[#EC5E54]/90',
    outline: 'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50',
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClassName} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;
