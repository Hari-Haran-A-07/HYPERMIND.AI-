'use client';

import { motion } from 'framer-motion';

export default function WorkspaceTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
