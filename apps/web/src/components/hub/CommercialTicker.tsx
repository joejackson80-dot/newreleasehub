'use client';
import React, { useEffect, useState, useRef } from 'react';
import { TrendingUp, Award, DollarSign, Percent } from 'lucide-react';

interface TickerItem {
  id: string;
  text: string;
  type: 'BID' | 'LICENSE' | 'SYSTEM';
}

interface Props {
  bids: any[];
  licenses: any[];
}

export default function CommercialTicker({ bids, licenses }: Props) {
  const [items, setItems] = useState<TickerItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newItems: TickerItem[] = [];

    // Add recent licenses
    licenses.slice(0, 5).forEach(lic => {
      newItems.push({
        id: `lic-${lic.id}`,
        type: 'LICENSE',
        text: `${lic.userId.toUpperCase()} SECURED ${(lic.allocatedBps / 100).toFixed(2)}% STAKE [VAL: $${(lic.feeCents / 100).toLocaleString()}]`
      });
    });

    // Add high bids
    bids.slice(0, 5).forEach(bid => {
      newItems.push({
        id: `bid-${bid.id}`,
        type: 'BID',
        text: `NEW BID FROM ${bid.userId.toUpperCase()}: $${(bid.offerAmountCents / 100).toLocaleString()} FOR ${(bid.requestedBps / 100).toFixed(2)}%`
      });
    });

    // Add system messages
    newItems.push({
      id: 'sys-1',
      type: 'SYSTEM',
      text: 'ARTIST RETAINS 100% MASTER OWNERSHIP • ALL LICENSES ARE COMMERCIAL PARTICIPATION AGREEMENTS • NEW RELEASE HUB VERIFIED'
    });

    setItems(newItems);
  }, [bids, licenses]);

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-black/80 backdrop-blur-md border-y border-white/5 h-10 flex items-center overflow-hidden relative group">
      {/* Ticker Animation Container */}
      <div className="flex animate-[ticker_60s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused]">
        {/* Duplicate the items for seamless looping */}
        {[...items, ...items].map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center mx-12 space-x-4">
             {item.type === 'LICENSE' && <Award className="w-3 h-3 text-[var(--color-gold)]" />}
             {item.type === 'BID' && <TrendingUp className="w-3 h-3 text-green-500" />}
             {item.type === 'SYSTEM' && <div className="w-1 h-1 rounded-full bg-gray-600"></div>}
             
             <span className={`text-[10px] font-mono font-bold tracking-widest ${
               item.type === 'LICENSE' ? 'text-white' : 
               item.type === 'BID' ? 'text-green-500' : 'text-gray-500'
             }`}>
               {item.text}
             </span>
             
             <span className="text-gray-800 font-bold px-2">//</span>
          </div>
        ))}
      </div>

      {/* Decorative Overlay */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
