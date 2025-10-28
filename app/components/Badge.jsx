// app/components/Badge.jsx
const Badge = ({ children, variant = 'default', className = '' }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap';

  const variantStyles = {
    default: 'bg-[#EC5E54] text-white',
    secondary: 'bg-[#f3f3f5] text-[#030213]',
    outline: 'border border-[#EC5E54]/30 text-gray-900 bg-white',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
