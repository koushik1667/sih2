import { motion } from 'motion/react';

export default function TextReveal({ children, delay = 0, className = '' }) {
  const words = String(children).split(' ');

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
          style={{ marginRight: '0.28em' }}
        >
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.65,
              delay: delay + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
