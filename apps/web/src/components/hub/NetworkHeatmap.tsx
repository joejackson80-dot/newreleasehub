'use client';
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function NetworkHeatmap() {
  // Generate random data points for the "Wall of Support"
  const points = useMemo(() => {
    return Array.from({ length: 60 }).map(() => ({
      height: Math.random() * 80 + 20,
      intensity: Math.random()
    }));
  }, []);

  return (
    <div className="w-full h-12 flex items-end space-x-0.5 opacity-50 hover:opacity-100 transition-opacity duration-700 overflow-hidden">
      {points.map((p, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${p.height}%` }}
          transition={{ delay: i * 0.01, duration: 1 }}
          className="flex-1 rounded-t-sm relative group"
          style={{ 
            backgroundColor: p.intensity > 0.8 ? '#f97316' : p.intensity > 0.4 ? '#ffffff33' : '#ffffff11'
          }}
        >
          {/* Tooltip on hover (Simulated) */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black border border-white/10 px-2 py-1 rounded text-[8px] font-bold text-white whitespace-nowrap z-50">
             {p.intensity > 0.8 ? 'MAJOR STAKE' : 'HIGH HYPE'}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
