/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const handleClick = () => {
    const url = 'https://wa.me/919491218950?text=Hello%20Jyothi%20Printing%20Works!%20I%20would%20like%20to%20discuss%20a%20printing%20order.';
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      id="floating-whatsapp-btn"
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-emerald-500/30 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center group"
      aria-label="Direct Chat with Print Consultant"
    >
      <MessageSquare className="h-6.5 w-6.5" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-350 text-xs font-black uppercase tracking-wider text-white select-none shrink-0">
        Inquire Now
      </span>
    </button>
  );
}
