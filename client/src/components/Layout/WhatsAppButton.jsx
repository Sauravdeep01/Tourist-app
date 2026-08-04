import React from 'react';
import { CONTACT_DETAILS } from '../../utils/constants';
import whatsappLogo from '../../assets/whatsapp.png';


export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${CONTACT_DETAILS.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-45 flex h-14 w-14 items-center justify-center rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      <img src={whatsappLogo} alt="WhatsApp" className="h-14 w-14 animate-float-updown" />

      {/* Label showing on hover */}
      <span className="absolute right-16 scale-0 bg-neutral-900 text-white text-xs font-semibold px-2 py-1.5 rounded-md shadow-md transition-all duration-300 group-hover:scale-100 whitespace-nowrap">
        WhatsApp Chat
      </span>
    </a>
  );
}
