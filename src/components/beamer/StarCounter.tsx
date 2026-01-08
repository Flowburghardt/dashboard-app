import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface StarCounterProps {
  value: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl',
};

export function StarCounter({ value, size = 'md' }: StarCounterProps) {
  const controls = useAnimation();
  const previousValue = useRef(value);

  useEffect(() => {
    if (value > previousValue.current) {
      controls.start({
        scale: [1, 1.3, 1],
        transition: { duration: 0.4 }
      });
    }
    previousValue.current = value;
  }, [value, controls]);

  return (
    <motion.div
      animate={controls}
      className={`font-bold text-wyt-accent ${sizeClasses[size]}`}
    >
      <span className="text-yellow-400 mr-1">★</span>
      {value}
    </motion.div>
  );
}
