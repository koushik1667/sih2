import { motion } from 'motion/react';

const PATHS = [
  { d: "M300 500 C298 440 294 370 285 300", delay: 0 },
  { d: "M285 300 C255 272 215 258 165 248", delay: 1.0 },
  { d: "M220 258 C198 236 172 222 142 216", delay: 1.9 },
  { d: "M285 300 C322 272 368 258 412 252", delay: 1.1 },
  { d: "M375 256 C402 234 432 222 458 218", delay: 2.0 },
  { d: "M285 300 C275 252 265 200 255 155", delay: 0.5 },
  { d: "M255 155 C240 135 218 122 192 118", delay: 2.6 },
  { d: "M255 155 C268 133 284 122 302 117", delay: 2.7 },
];

const NODES = [
  { cx: 165, cy: 248, r: 2.5, delay: 3.8 },
  { cx: 142, cy: 216, r: 2, delay: 4.1 },
  { cx: 412, cy: 252, r: 2.5, delay: 3.9 },
  { cx: 458, cy: 218, r: 2, delay: 4.2 },
  { cx: 192, cy: 118, r: 2.5, delay: 4.5 },
  { cx: 302, cy: 117, r: 2, delay: 4.6 },
];

export default function OrganicTracer({ className = '' }) {
  return (
    <svg
      viewBox="0 0 600 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {PATHS.map((path, i) => (
        <motion.path
          key={i}
          d={path.d}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: { duration: 3.5, delay: path.delay, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.3, delay: path.delay },
          }}
        />
      ))}
      {NODES.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r={0}
          fill="currentColor"
          animate={{ r: node.r }}
          transition={{
            duration: 0.5,
            delay: node.delay,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
        />
      ))}
    </svg>
  );
}
