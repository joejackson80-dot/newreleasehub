'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Reaction {
  id: number;
  x: number;
  emoji: string;
}

export default function FloatingReactions({ trigger }: { trigger: number }) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const emojis = ['🔥', '🔥', '❤️', '🔥', '⚡', '✨'];

  const spawnReaction = useCallback(() => {
    const id = Date.now();
    const x = Math.random() * 100 - 50; // Random horizontal spread
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    setReactions(prev => [...prev, { id, x, emoji }]);
    
    // Remove after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    if (trigger > 0) {
      spawnReaction();
      // Spawn a burst
      for(let i=0; i<3; i++) {
        setTimeout(spawnReaction, i * 100);
      }
    }
  }, [trigger, spawnReaction]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <AnimatePresence>
        {reactions.map((r) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, scale: 0.5, y: 0, x: `${50 + r.x}%` }}
            animate={{ 
              opacity: [0, 1, 1, 0], 
              scale: [0.5, 1.2, 1, 0.8],
              y: -400,
              x: `${50 + r.x + (Math.random() * 20 - 10)}%` 
            }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute bottom-10 text-3xl select-none"
          >
            {r.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


