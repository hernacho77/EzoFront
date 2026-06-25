import { motion } from 'framer-motion';

const Button = ({ children, onClick, type = "button", disabled = false, className = "" }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        w-full py-3 px-6 rounded-lg font-semibold tracking-wide
        transition-colors duration-200 shadow-lg
        ${disabled 
          ? 'bg-gray-600 text-gray-400 cursor-not-allowed shadow-none' 
          : 'bg-primary text-white hover:bg-indigo-500 shadow-primary/20 hover:shadow-primary/40'}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default Button;
