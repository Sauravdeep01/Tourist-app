import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CONTACT_DETAILS } from '../../utils/constants';

export default function WhatsAppButton() {
  const { user } = useContext(AuthContext);

  // Gated: only visible to logged-in users (C-6)
  if (!user) return null;

  return (
    <a
      href={`https://wa.me/${CONTACT_DETAILS.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-45 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
      aria-label="Chat on WhatsApp"
    >
      <svg
        className="h-7 w-7 fill-current"
        viewBox="0 0 24 24"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.517 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.48 1.966 14.015 1.01 11.997 1.01c-5.444 0-9.87 4.372-9.874 9.802-.001 1.768.482 3.49 1.396 5.011l-.997 3.643 3.743-.974zm11.367-7.46c-.328-.163-1.937-.945-2.236-1.053-.298-.11-.517-.162-.73.163-.215.324-.83.829-1.02 1.047-.188.218-.378.243-.705.082-.328-.162-1.385-.505-2.637-1.613-.973-.862-1.63-1.927-1.821-2.253-.189-.328-.02-.505.143-.668.148-.147.328-.382.493-.574.165-.192.219-.328.328-.547.11-.219.056-.411-.027-.574-.083-.163-.73-1.745-1.002-2.392-.262-.64-.53-.553-.73-.563-.186-.01-.398-.01-.611-.01-.213 0-.56.08-.853.398-.293.32-.1.12-1.122 1.112-.829.808-1.436 1.848-1.621 3.21-.295 2.146.7 4.256 1.378 5.174.08.108 2.5 3.822 6.064 5.36 2.973 1.282 4.28.1 5.034-.143 1.057-.34 2.236-.913 2.548-1.745.311-.832.311-1.546.218-1.696-.093-.15-.34-.242-.668-.405z" />
      </svg>
      
      {/* Label showing on hover */}
      <span className="absolute right-16 scale-0 bg-neutral-900 text-white text-xs font-semibold px-2 py-1.5 rounded-md shadow-md transition-all duration-300 group-hover:scale-100 whitespace-nowrap">
        WhatsApp Chat
      </span>
    </a>
  );
}
