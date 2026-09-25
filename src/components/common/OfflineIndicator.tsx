import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#161B28]/95 border border-amber-500/40 px-4 py-1.5 text-xs font-semibold text-amber-400 shadow-xl backdrop-blur-md"
        >
          <WifiOff className="w-3.5 h-3.5 animate-pulse" />
          <span>Modo Sin Conexión · Usando fondos en caché</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
