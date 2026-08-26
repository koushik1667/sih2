import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

export default function TiltCard({ children, className = '', intensity = 7 }) {
  const ref = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotX = useTransform(rawY, [-0.5, 0.5], [intensity, -intensity]);
  const rotY = useTransform(rawX, [-0.5, 0.5], [-intensity, intensity]);
  const springX = useSpring(rotX, { stiffness: 180, damping: 28 });
  const springY = useSpring(rotY, { stiffness: 180, damping: 28 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={e => {
        const r = ref.current.getBoundingClientRect();
        rawX.set((e.clientX - r.left) / r.width - 0.5);
        rawY.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformStyle: 'preserve-3d',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
